import { _decorator, Component, EventTouch, Node, Vec2 } from 'cc';
import { GridManager } from './GridManager';
const { ccclass, property } = _decorator;

@ccclass('ControllManager')
export class ControllManager extends Component {

    @property(Node)
    GridManager: Node = null;

    private startTouch: Vec2 = null
    private endTouch: Vec2 = null
    private minSwipeDistance: number = 50

    protected onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
    }
    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this)
    }

    onTouchStart(event: EventTouch) {
        this.startTouch = event.getLocation()
    }
    onTouchEnd(event: EventTouch) {
        this.endTouch = event.getLocation()
        this.handleSwipe()
    }
    handleSwipe() {
        if (this.startTouch && this.endTouch) {
            const swipeDirection = this.getSwipeDirection()
            if (swipeDirection) {
                this.GridManager.getComponent(GridManager).slide({}, swipeDirection)
            }
        }
    }
    calculateDistance(vec: Vec2) {
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y)
    }
    getSwipeDirection() {
        const direction = new Vec2(this.endTouch.x - this.startTouch.x, this.endTouch.y - this.startTouch.y)
        if (this.calculateDistance(direction) > this.minSwipeDistance) {
            if (Math.abs(direction.x) > Math.abs(direction.y)) {
                return direction.x > 0 ? 'right' : 'left'
            } else {
                return direction.y > 0 ? 'up' : 'down'
            }
        }
        return null
    }
}


