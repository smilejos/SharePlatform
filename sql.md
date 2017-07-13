```sql
USE [JustBlog]
GO

/****** Object:  Table [dbo].[Article]    Script Date: 07/13/2017 17:27:44 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[Article](
	[ArticleNo] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](100) NULL,
	[Author] [int] NULL,
	[Editor] [int] NULL,
	[Content] [varchar](max) NULL,
	[Tag] [nvarchar](500) NULL,
	[UpdateTime] [datetime2](0) NULL,
	[PublishTime] [datetime2](0) NULL,
	[isBookArticle] [bit] NULL,
	[isPrivate] [bit] NULL,
	[isSlideshow] [bit] NULL,
 CONSTRAINT [PK_Blog] PRIMARY KEY CLUSTERED 
(
	[ArticleNo] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

ALTER TABLE [dbo].[Article] ADD  CONSTRAINT [DF_Article_isBookArticle]  DEFAULT ((0)) FOR [isBookArticle]
GO

ALTER TABLE [dbo].[Article] ADD  CONSTRAINT [DF_Article_isPrivate]  DEFAULT ((0)) FOR [isPrivate]
GO

ALTER TABLE [dbo].[Article] ADD  CONSTRAINT [DF_Article_isSlideshow]  DEFAULT ((0)) FOR [isSlideshow]
GO
```sql

```sql
USE [JustBlog]
GO

/****** Object:  Table [dbo].[Book]    Script Date: 07/13/2017 17:28:05 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[Book](
	[BookNo] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](50) NULL,
	[Author] [char](6) NULL,
	[Tag] [nvarchar](50) NULL,
	[UpdateTime] [datetime2](0) NULL,
	[PublishTime] [datetime2](0) NULL,
	[isPrivate] [bit] NULL,
 CONSTRAINT [PK_Book] PRIMARY KEY CLUSTERED 
(
	[BookNo] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO
```

```sql
USE [JustBlog]
GO

/****** Object:  Table [dbo].[Category]    Script Date: 07/13/2017 17:28:16 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[Category](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](20) NOT NULL,
	[Type] [varchar](20) NOT NULL,
 CONSTRAINT [PK_Category] PRIMARY KEY CLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO
```

```sql
USE [JustBlog]
GO

/****** Object:  Table [dbo].[CoEditor]    Script Date: 07/13/2017 17:28:32 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[CoEditor](
	[ArticleNo] [int] NULL,
	[Editor] [int] NULL,
	[AssignTime] [datetime2](0) NULL
) ON [PRIMARY]

GO
```


```sql
USE [JustBlog]
GO

/****** Object:  Table [dbo].[Image]    Script Date: 07/13/2017 17:28:50 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[Image](
	[ArticleNo] [int] NULL,
	[UID] [char](36) NULL,
	[FileName] [nvarchar](50) NULL,
	[FileSize] [int] NULL,
	[dtime] [datetime2](0) NULL
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO
```

```sql
USE [JustBlog]
GO

/****** Object:  Table [dbo].[Chapter]    Script Date: 07/13/2017 17:29:35 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[Chapter](
	[ChapterNo] [int] IDENTITY(1,1) NOT NULL,
	[ChapterTitle] [nvarchar](50) NULL,
	[ChapterOrder] [int] NULL,
	[ChapterContent] [varchar](max) NULL,
	[BookNo] [int] NOT NULL,
 CONSTRAINT [PK_Chapter] PRIMARY KEY CLUSTERED 
(
	[ChapterNo] ASC,
	[BookNo] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO
```

```sql
USE [JustBlog]
GO

/****** Object:  Table [dbo].[ChapterNode]    Script Date: 07/13/2017 17:29:46 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[ChapterNode](
	[ChapterNo] [int] NOT NULL,
	[ArticleNo] [int] NOT NULL,
	[ArticleOrder] [int] NOT NULL,
	[NodeTitle] [varchar](50) NULL,
 CONSTRAINT [PK_ChapterLink] PRIMARY KEY CLUSTERED 
(
	[ChapterNo] ASC,
	[ArticleNo] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO
```