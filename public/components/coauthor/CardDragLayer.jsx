import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import Card from './Card';

const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100000
};

const cardStyles = {
    display: 'inline-block',
    transform: 'rotate(-7deg)',
    WebkitTransform: 'rotate(-7deg)'
}
    

function getItemStyles(props) {
    const { currentOffset } = props;
    if (!currentOffset) {
        return {
            display: 'none'
        };
    }

    let { x, y } = currentOffset;
    x = x - 500;
    y = y - 150;

    const transform = `translate(${x}px, ${y}px)`;
    return {
        WebkitTransform: transform,
        transform
    };
}

@DragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging()
}))
export default class CustomDragLayer extends Component {

    render() {
        const { item, isDragging } = this.props;
        let style = getItemStyles(this.props);

        if (!isDragging) {
            return null;
        }
        return (
            <div style={layerStyles}>
                <div style={style}>
                    <div style={cardStyles}>
                        <Card user={item.user} />
                    </div>
                </div>
            </div>
        );
    }
}
