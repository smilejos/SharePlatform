var fs = require("fs"),
    rimraf = require("rimraf"),    
    mkdirp = require("mkdirp"),
    multiparty = require('multiparty'),
    // paths/constants
    fileInputName = "qqfile",
    uploadedFilesPath = './images/',
    chunkDirName = "chunks",
    port = 8000,
    maxFileSize = 0,
    ArticleHandler = require('../database/articleHandler'); // in bytes, 0 for unlimited

module.exports = {
    onUpload: onUpload,
    onDeleteFile: onDeleteFile
}

function onUpload(req, res) {
    var form = new multiparty.Form();
    
    form.parse(req, function(err, fields, files) {
        var partIndex = fields.qqpartindex;
        // text/plain is required to ensure support for IE9 and older
        res.set("Content-Type", "text/plain");

        if (partIndex == null) {
            onSimpleUpload(fields, files[fileInputName][0], res);
        }
        else {
            onChunkedUpload(fields, files[fileInputName][0], res);
        }
    });
}

function onSimpleUpload(fields, file, res) {
    var uuid = fields.qquuid,
        folder = fields.articleNo,
        responseData = {
            success: false,
            articleNo: fields.articleNo[0],
            fileName: fields.qqfilename[0],
            fileSize: file.size,
            uuid: fields.qquuid[0],
            thumbnailUrl: `http://localhost:8888/${fields.articleNo[0]}/${fields.qquuid[0]}/${fields.qqfilename[0]}`
        };
        
    file.name = fields.qqfilename;

    if (isValid(file.size)) {
        moveUploadedFile(folder, file, uuid, function () {
                ArticleHandler.uploadImage(folder, uuid, file.name, file.size, function () { 
                    responseData.success = true;
                    res.send(responseData);    
                });
            },
            function() {
                responseData.error = "Problem copying the file!";
                res.send(responseData);
            });
    }
    else {
        failWithTooBigFile(responseData, res);
    }
}

function onChunkedUpload(fields, file, res) {
    var size = parseInt(fields.qqtotalfilesize),
        uuid = fields.qquuid,
        folder = fields.articleNo,
        index = fields.qqpartindex,
        totalParts = parseInt(fields.qqtotalparts),
        responseData = {
            success: false
        };

    file.name = fields.qqfilename;

    if (isValid(size)) {
        storeChunk(folder, file, uuid, index, totalParts, function() {
            if (index < totalParts - 1) {
                responseData.success = true;
                res.send(responseData);
            }
            else {
                combineChunks(folder, file, uuid, function() {
                        responseData.success = true;
                        res.send(responseData);
                    },
                    function() {
                        responseData.error = "Problem conbining the chunks!";
                        res.send(responseData);
                    });
            }
        },
        function(reset) {
            responseData.error = "Problem storing the chunk!";
            res.send(responseData);
        });
    }
    else {
        failWithTooBigFile(responseData, res);
    }
}

function failWithTooBigFile(responseData, res) {
    responseData.error = "Too big!";
    responseData.preventRetry = true;
    res.send(responseData);
}

function onDeleteFile(req, res) {
    var uuid = req.params.uuid,
        folder = req.query.articleNo,
        dirToDelete = uploadedFilesPath + folder + "/" + uuid;
    
    rimraf(dirToDelete, function(error) {
        if (error) {
            res.status(500);
        }
        
        ArticleHandler.deleteImageByUID(uuid, function () { 
            res.send();
        });
        
    });
}

function isValid(size) {
    return maxFileSize === 0 || size < maxFileSize;
}

function moveFile(destinationDir, sourceFile, destinationFile, success, failure) {
    mkdirp(destinationDir, function(error) {
        var sourceStream, destStream;

        if (error) {
            console.error("Problem creating directory " + destinationDir + ": " + error);
            failure();
        }
        else {
            sourceStream = fs.createReadStream(sourceFile);
            destStream = fs.createWriteStream(destinationFile);

            sourceStream
                .on("error", function(error) {
                    console.error("Problem copying file: " + error.stack);
                    destStream.end();
                    failure();
                })
                .on("end", function(){
                    destStream.end();
                    success();
                })
                .pipe(destStream);
        }
    });
}

function moveUploadedFile(folder, file, uuid, success, failure) {
    var destinationDir = uploadedFilesPath + folder + "/" + uuid + "/",
        fileDestination = destinationDir + file.name;

    moveFile(destinationDir, file.path, fileDestination, success, failure);
}

function storeChunk(folder, file, uuid, index, numChunks, success, failure) {
    var destinationDir = uploadedFilesPath + folder + "/" + uuid + "/" + chunkDirName + "/",
        chunkFilename = getChunkFilename(index, numChunks),
        fileDestination = destinationDir + chunkFilename;
    moveFile(destinationDir, file.path, fileDestination, success, failure);
}

function combineChunks(folder, file, uuid, success, failure) {
    var chunksDir = uploadedFilesPath + folder + "/" + uuid + "/" + chunkDirName + "/",
        destinationDir = uploadedFilesPath + folder + "/" + uuid + "/",
        fileDestination = destinationDir + file.name;


    fs.readdir(chunksDir, function(err, fileNames) {
        var destFileStream;

        if (err) {
            console.error("Problem listing chunks! " + err);
            failure();
        }
        else {
            fileNames.sort();
            destFileStream = fs.createWriteStream(fileDestination, {flags: "a"});

            appendToStream(destFileStream, chunksDir, fileNames, 0, function() {
                rimraf(chunksDir, function(rimrafError) {
                    if (rimrafError) {
                        console.log("Problem deleting chunks dir! " + rimrafError);
                    }
                });
                success();
            },
            failure);
        }
    });
}

function appendToStream(destStream, srcDir, srcFilesnames, index, success, failure) {
    if (index < srcFilesnames.length) {
        fs.createReadStream(srcDir + srcFilesnames[index])
            .on("end", function() {
                appendToStream(destStream, srcDir, srcFilesnames, index + 1, success, failure);
            })
            .on("error", function(error) {
                console.error("Problem appending chunk! " + error);
                destStream.end();
                failure();
            })
            .pipe(destStream, {end: false});
    }
    else {
        destStream.end();
        success();
    }
}

function getChunkFilename(index, count) {
    var digits = new String(count).length,
        zeros = new Array(digits + 1).join("0");

    return (zeros + index).slice(-digits);
}
