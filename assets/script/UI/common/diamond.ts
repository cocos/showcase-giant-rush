import { _decorator, Component, Node, Label } from 'cc';
import { constant } from './../../framework/constant';
import { util } from './../../framework/util';
import { GameManager } from './../../fight/gameManager';
import { playerData } from './../../framework/playerData';
import { clientEvent } from '../../framework/clientEvent';
import { uiManager } from '../../framework/uiManager';
const { ccclass, property } = _decorator;

@ccclass('Diamond')
export class Diamond extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property(Label)
    public lbDiamondNum: Label = null!;

    private _curDiamondNum: number = 0;
    private _targetDiamondNum: number = 0;
    private _interval: number = 0;
    private _ratio: number = 0;
    private _callback: Function = () => { };

    onEnable () {
        clientEvent.on(constant.EVENT_TYPE.REFRESH_DIAMOND, this._refreshDiamond, this);
    }

    onDisable () {
        clientEvent.off(constant.EVENT_TYPE.REFRESH_DIAMOND, this._refreshDiamond, this);
    }

    start () {
        this._refreshDiamond();
    }

    /**
     * 数量累加
     *
     * @param {number} targetDiamondNum 目标总数
     * @param {number} [interval=0.1] 每隔多久执行一次数目累加
     * @param {number} [ratio=0.25] 差值比例
     * @param {Function} [callback=()=>{}] 回调函数
     * @memberof Diamond
     */
    public startRaise (targetDiamondNum: number, interval: number = 0.1, ratio: number = 0.25, callback: Function = () => { }) {
        this._curDiamondNum = 0;
        this._targetDiamondNum = targetDiamondNum;
        this._interval = interval;
        this._ratio = ratio;
        this._callback = callback;

        this.schedule(this._numRaise, interval);
    }

    private _numRaise () {
        this._curDiamondNum = util.lerp(this._targetDiamondNum, this._curDiamondNum, this._ratio);
        this.lbDiamondNum.string = util.formatMoney(playerData.instance.playerInfo.diamond + Math.ceil(this._curDiamondNum));

        if (Math.ceil(this._curDiamondNum) === this._targetDiamondNum) {
            this.unschedule(this._numRaise);
            GameManager.addDiamond(this._targetDiamondNum);
            this._callback && this._callback();
        }
    }

    private _refreshDiamond () {
        this.lbDiamondNum.string = util.formatMoney(playerData.instance.playerInfo.diamond);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
