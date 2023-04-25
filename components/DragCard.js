import { useDrag } from "react-dnd";
import OrderItem from "@/components/OrderItem";
import { FaFolderOpen } from 'react-icons/fa';

export default function DragCard({ order }) {
    const [{ isDragging }, dragRef] = useDrag({
        type: "language",
        item: { order },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div>
            <div ref={dragRef}>
                <OrderItem key={order.id} order={order} />
                {isDragging && <FaFolderOpen/>}
            </div>
        </div>
    );
}
