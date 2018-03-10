/* eslint no-console: "off" */
/**
 * h('div', {
 *  class:{
 *   tactics__table_operation:true 
 *  }
 * }, [
 *  h('span', {
 *    style = {
 *     marginRight: '20px' 
 *    },
 *    on: {
        click: () => {}
      }, 
 *  }, [
 *    h('span',xxxx),
 *    '检修记录33333333'
 *  ])
 * ])
 */
const str = `<div class='tactics__table_operation'>
        <p
          style='margin-right:20px'
          onclick='() => {}'
        >
          <span class='tactics__table_icon'>
            <i class="ivu-icon ivu-icon-clipboard"></i>
          </span>
          检修记录33333333
        </p>
        <ul>
          <li title='11111'>11111</li>
          <li props-size='lang'>22222</li>
        </ul>
      </div>`;

// 是否用于原生的props
const useDomProps = (params, tag, type, attr, value) => {
	const acceptValue = ['input','textarea','option','select'];
	if (
    (attr === 'value' && acceptValue.includes(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
 ){
		params['domProps'] = (params['domProps'] || {});
		params['domProps'][attr] = value;
		return true;
	}
};

// 是否用于props
const useProps = (params, attr, value) => {
	if(attr.startsWith('props-')){
		params['props'] = params['props'] || {};
		params['props'][attr.slice(6)] = value;
		return true;
	}
};

// 是否用于attrs
const useAttrs = (params, attr, value) => {
	if(attr.startsWith('attrs-')){
		params['attrs'] = params['attrs'] || {};
		params['attrs'][attr.slice(6)] = value;
		return true;
	}
};

// 是否用于on
const useOn = (params, attr, value) => {
	if(attr.startsWith('on')){
		params['on'] = params['on'] || {};
		params['on'][attr.slice(2)] = value;
		return true;
	}
};

// 是否用于nativeOn
const useNativeOn = (params, attr, value) => {
	if(attr.startsWith('nativeOn')){
		params['nativeOn'] = params['nativeOn'] || {};
		params['nativeOn'][attr.slice(8)] = value;
		return true;
	}
};

// 是否用于class
const useClass = (params, attr, value) => {
	if(attr === 'class'){
		params['class'] = params['class'] || {};
		value.split(' ').forEach(element => {
			params['class'][element] = true;
		});
		return true;
	}
};

// 是否用于style
const useStyle = (params, attr, value) => {
	if(attr === 'style'){
		params['style'] = params['style'] || {};
		value.split(';').forEach(element => {
			let styles = element.split(':');
			let key;
			key = styles[0].replace(/\-(\w)/,r => r.toUpperCase().slice(1));
			params['style'][key] = styles[1];
		});
		return true;
	}
};

const deepNode = (node, childernList, callback) => {
  // 删除字符串节点
	if(node.nodeType === 3)return false;
  // 获取当前节点的字节点
	let childNodes = node.childNodes;
	let length = childNodes.length;
  // 获取当前节点下的attr
	let params = {};
	let attrs = [...node.attributes];
  // 组合参数
	for(let i=0;i<attrs.length;i++){
		let isDomProps = useDomProps(params, node.tagName.toLowerCase(), node.getAttribute['type'], attrs[i].name, attrs[i].value);
		let isProps = useProps(params, attrs[i].name, attrs[i].value);
		let isAttrs = useAttrs(params, attrs[i].name, attrs[i].value);
		let isOn = useOn(params, attrs[i].name, attrs[i].value);
		let isNativeOn = useNativeOn(params, attrs[i].name, attrs[i].value);
		let isClass = useClass(params, attrs[i].name, attrs[i].value);
		let isStyle = useStyle(params, attrs[i].name, attrs[i].value);
		if(!(isDomProps || isProps || isAttrs || isOn || isNativeOn || isClass || isStyle )){
			params[attrs[i].name] = attrs[i].value;
		}
	}
  // 创建字节点数组
	let childern = [];
	childernList.push(childern);
	for(let i=0;i<length;i++){
		deepNode(childNodes[i], childern, callback);
	}
  // 将子节点执行完结果添加到数组里
	childern.push(callback.call(node, params, childernList));
};
const h = function(tagName, params, childern){
	console.log('------执行到h函数啦------');
	console.log('当前执行h函数的标签是',tagName);
	console.log('当前执行h函数的params是',params);
	console.log('当前执行h函数的childer是',childern);
	console.log('^^^^^^^^^^^^^^^^^^^^^^');
	return tagName+'=======>';
};
const jsx2h = (template, h, params) => {

  // 各种错误校验
	let oD = document.createElement('div');
	if(typeof template !== 'string'){
		return Error('jsx2h template mast string!');
	}
	oD.innerHTML = template; 
	let nodes = oD.childNodes;
	if(nodes.length > 1){
		return Error('jsx2h mast 包含一个节点');
	}
  

	deepNode(nodes[0], [], function(param,childern){
		return h(this.tagName.toLowerCase(), param, childern);
	});
};


const reslut = jsx2h(str, h, {});
console.log(reslut);
