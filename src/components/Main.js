require('normalize.css/normalize.css');
require('../styles/App.scss');

import React from 'react';

// 获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');

// 利用自执行函数，将图片信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDataArr) {
	let len = imageDataArr.length;
	for (let i = 0; i < len; i++) {
		let singleImageData = imageDataArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDataArr[i] = singleImageData;
	}
	return imageDataArr;
})(imageDatas);

// let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
	render() {
		return (
			<section className="stage">
				<section className="img-src">
					
				</section>
				<nav className='controller-nav'>
					
				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;