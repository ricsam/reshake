import React from 'react';
import styled, { keyframes } from 'styled-components';
import classNames from 'classnames';

const Shake = ({
	h = 5,
	v = 5,
	r = 3,
	dur = 300,
	q = 'infinite',
	tf = 'ease-in-out',
	int = 10,
	max = 100,
	orig = 'center center',
	fixed = false,
	freez = false,
	active = true,
	trigger = ':hover',
	fixedStop = false,
  elem = 'div',
	...props,
}) => {
	const random = (max, min = 0) => {
		return (Math.random() * (max - min) - max / 2);
	};
	
	const doKeyframes = () => {
		// el objecto que iremos llenando
		let kf = {};
		const init = 'translate(0,0) rotate(0)';
		
		// loop con intervalos basados en `int`
		for (let st = int; st <= max; st += int) {
			// Numeros aleatorios en cada keyframe
			const x = random(h);
			const y = random(v);
			const rot = random(r);
			
			kf[`${st}%`] = {
				transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
			}
		}
		
		// Init de las transformaciones en 0% y 100%
		kf[`0%`] = kf[`100%`] =  {
			transform: init,
		}
		
		// Init también en caso el `max` < 100
		if (max < 100) {
			kf[`${max}%`] = {
				transform: init,
			}
		}
		
		return kf;
	};

	// Creamos los `@keyframes`
	const kf = doKeyframes();
	
	const toString = (obj) => {
		return Object.keys(obj).reduce((acc, next) => {
			return `${acc}
			${next} {
				transform: ${obj[next].transform}
			}`
		}, '')
	};
	
	const shakeKeyframes = keyframes`${toString(doKeyframes())}`;
  
  const shouldShakeDefault = fixed || (!fixed && freez);
  const shouldShakeWhenTriggered = !fixed && !freez;
	
	const ShakeComp = styled[elem]`
		animationName: ${shouldShakeDefault && shakeKeyframes};
		animationDuration: ${dur}ms;
  	animationIterationCount: ${q};
		display: 'inline-block';
		transformOrigin: ${orig};
		
		&${trigger} {
			animationName: ${shouldShakeWhenTriggered && shakeKeyframes};
			animationPlayState: ${freez && (!fixed ? 'running' : 'paused')};
			animation: ${fixed && fixedStop && 'initial'};
		}
		
		animationPlayState: ${freez && (!fixed ? 'paused' : 'running')};
	`;
		
	return (
		<ShakeComp { ...props }>
  		{ props.children }
  	</ShakeComp>
	);
};

export default Shake;
