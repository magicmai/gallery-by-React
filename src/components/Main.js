require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

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

class ImgFigure extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<figure className="img-figure">
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		)
	}
}

class AppComponent extends React.Component {

	Constant: {
		centerPos: {
			left: 0,
			right: 0
		},
		hPosRange: { // 水平方向的取值范围
			leftSecX: [0, 0],
			rightSecX: [0, 0],
			y: [0, 0]
		},
		vPosRange: { // 垂直方向的取值范围
			x: [0, 0],
			topY: [0, 0]
		}
	},

	/*
	 * 重新布局所有图片
	 * @param centerIndex 制定居中排布哪个图片
	 */
	rearrange: function(centerIndex) {},

	this.state = {
		imageArrangeArr: [

		]
	}

	// 组件加载以后，为每张图片计算其位置的范围
	componentDidMount() {

		// 首先拿到舞台的大小
		let stageDOM = React.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		// 拿到一个imgFigure的大小
		var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		// 计算中心图片的位置点
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}

		// 计算左侧、右侧区域图片排布位置的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW - halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		// 计算上侧区域图片排布位置的取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfImgW;

		this.rearrange(0);

	}

	render() {
		let controllerUnits = [],
			imgFigures = [];
		imageDatas.forEach((value, index) => {
			imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index}/>);
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