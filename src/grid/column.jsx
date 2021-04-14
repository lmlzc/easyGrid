import React from 'react'
import { useDrag, useDrop } from 'react-dnd'

const DND_ITEM_TYPE = 'col'
const style = {
    cursor: 'move',
    width:'200px'
};
export default function Column({ column, index, moveCol }) {
    const dropRef = React.useRef(null)
    const dragRef = React.useRef(null)
    const [{ handlerId }, drop] = useDrop({
        accept: DND_ITEM_TYPE,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
      
        drop(item, monitor) {
            console.log(item, monitor)
            if (!dropRef.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }
            console.log(dragIndex, hoverIndex)
             moveCol(dragIndex, hoverIndex)
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
             item.index = hoverIndex
        },
    })

    const [{ isDragging }, drag, preview] = useDrag({
        type: DND_ITEM_TYPE,
        item: () => {
            return { id: column, index };
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const opacity = isDragging ? 0 : 1
    preview(drop(dropRef))
    drag(drop(dropRef));
    // drag(dragRef)
    return (
        <th ref={dropRef} {...column.getHeaderProps()} style={{ ...style}} data-handler-id={handlerId}>
            {// Render the header
                column.render('Header')}
        </th>
    )
}
