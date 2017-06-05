require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');

// 利用自执行函数，将图片信息转成图片URL路径信息
imageDatas = ((imagesDataArr) => {
	let len = imagesDataArr.length;
	for (let i = 0; i < len; i++) {
		let singleImageData = imagesDataArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imagesDataArr[i] = singleImageData;
	}
	return imagesDataArr;
})(imageDatas);


/* 获取区间内的一个随机值 */
function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

// 获取 0~30° 的一个正负值
function get30DegRandom() {
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

class ImgFigure extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	// imgFigure 的点击处理函数
	handleClick(e) {
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			//console.log('center() works!');
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	}

	render() {
		let styleObj = {};

		// 如果 props 属性中指定了这张图片的位置，则使用
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		// 事居中图片不受边缘图片遮挡
		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}

		// 如果图片的旋转角度有值并且不为0，添加旋转角度
		if (this.props.arrange.rotate) {
			(['MozT', 'msT', 'WebkitT', 'OT', '']).forEach(
				(value) => styleObj[value + 'transform'] = `rotate(${this.props.arrange.rotate}deg)`
			);
		}

		var imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img key={this.props.data.imageURL} src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		)
	}
}

class AppComponent extends React.Component {
	constructor(props) {
		super(props);

		this.Constant = {
			centerPos: { //中心点的取值
				left: 0,
				top: 0
			},
			hPosRange: { // 水平方向的取值范围
				leftSecX: [0, 0],
				rightSecX: [0, 0],
				y: [0, 0]
			},
			vPosRange: { // 垂直方向的取值范围
				x: [0, 0],
				topSecY: [0, 0]
			}
		};

		this.state = {
			imgsArrangeArr: [
				/*{
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0, //旋转角度
					isInverse: false, //图片正反面，默认正面
					isCenter: false //图片是否居中，默认不居中
				}*/
			]
		};
	}

	/*
	 * 翻转图片
	 * @param index 输入当前被执行 inverse 操作的图片对应的图片信息数组的 index 值
	 * @return {Function} 这是一个闭包函数，其内 return 一个真正待被执行的函数
	 */
	inverse(index) {
		return () => {
			let imgsArrangeArr = this.state.imgsArrangeArr;

			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}
	}

	/*
	 * 重新布局所有图片
	 * @param centerIndex 制定居中排布哪个图片
	 */
	rearrange(centerIndex) {
		let imgsArrangeArr = this.state.imgsArrangeArr, // []
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topSecY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
			topImgSpliceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

		/* 注意：centerIndex 和 topImgSpliceIndex 可能会随机生成一样
		 * 此时应该重新生成
		 */
		while (topImgSpliceIndex === centerIndex) {
			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
		}

		// 首先居中 centerIndex 的图片，居中的 centerIndex 的图片不需要旋转
		imgsArrangeCenterArr[0] = {
			pos: centerPos,
			rotate: 0,
			isCenter: true
		}

		// 取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		// 布局位于上侧的图片
		imgsArrangeTopArr.forEach((value, index) => {
			imgsArrangeTopArr[index] = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			};
		});

		// 布局左右两侧的图片
		for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			var hPosRangeLORX = null; // Left Or Right X

			// 前半部分布局左边，右半部分布局右边
			if (i < k) {
				hPosRangeLORX = hPosRangeLeftSecX;
			} else {
				hPosRangeLORX = hPosRangeRightSecX;
			}

			imgsArrangeArr[i] = {
				pos: {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			};
		}

		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		}

		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});
	}

	/*
	 * 利用 rearrange 函数，居中对应 index 图片
	 * @param index, 需要被居中的图片对应的图片信息数组的 index 值
	 * @return {Function}
	 */

	center(index) {
		return () => {
			this.rearrange(index);
		};
	}


	// 组件加载以后，为每张图片计算其位置的范围
	componentDidMount() {

		// 首先拿到舞台的大小
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.floor(stageW / 2),
			halfStageH = Math.floor(stageH / 2);

		// 拿到一个imgFigure的大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.floor(imgW / 2),
			halfImgH = Math.floor(imgH / 2);

		// 计算中心图片的位置点
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		};

		// 计算左侧、右侧区域图片排布位置的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		// 计算上侧区域图片排布位置的取值范围
		this.Constant.vPosRange.topSecY[0] = -halfImgH;
		this.Constant.vPosRange.topSecY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrange(0);
	}

	render() {
		let controllerUnits = [],
			imgFigures = [];
		imageDatas.forEach((value, index) => {
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				};
			}
			imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
		});

		return (
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className='controller-nav'>
					{controllerUnits}
				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;