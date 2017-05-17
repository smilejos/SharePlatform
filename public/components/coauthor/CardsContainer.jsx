import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import Card from './Card'

const CardsTarget = {
    drop(props, monitor, component) {
        let { worker_no, source } = monitor.getItem();
        let target = props.container;
        props.onDrop(worker_no, source, target);
    }
};

@DropTarget("CardTransfer", CardsTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))
export default class CardsContainer extends Component {
     constructor(props) {
        super(props);
        this._renderCard = this._renderCard.bind(this);
    }  
    
     _renderCard(user, index) {
        const { onDrop, container } = this.props;
        return <Card user={user} key={index} onDrop={onDrop} container={container} />
    }

    render() {
        const { connectDropTarget, title, users, } = this.props;
        return connectDropTarget(
            <div className="CardsLayout">
                <div className="Title">{title}</div>
                <div className="CardsContainer">{users && users.length > 0 && users.map(this._renderCard)}</div>
            </div>
        );
    }
}