import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import UserCard from '../common/UserCard'

const CardsSource = {
    beginDrag(props, monitor) {
        return {
            user: props.user,
            worker_no: props.user.worker_no,
            source: props.container
        };
    }
};

@DragSource("CardTransfer", CardsSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
}))
export default class Card extends Component {
    componentDidMount() {
        this.props.connectDragPreview(getEmptyImage(), {
            captureDraggingState: true
        });
    }

    render() {
        const { isDragging, connectDragSource } = this.props;
        return connectDragSource(
            <div className="Box">
                <UserCard user={this.props.user} />
            </div>
        );
    }
}