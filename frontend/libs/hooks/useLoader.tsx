import { useEffect, useState } from 'react';

interface IRenderOptions {
	dest: () => JSX.Element | JSX.Element[];
	alt?: () => JSX.Element | JSX.Element[];
	load?: () => JSX.Element | JSX.Element[];
}

// Hook providing loader logic for a component
const useLoader = (condition: boolean | null, renders: IRenderOptions) => {
	const [renderCondition, setRenderCondition] = useState(condition);
	let renderedPage: any = <></>;
	useEffect(() => {
		setRenderCondition(condition);
	}, [condition]);

	switch (renderCondition) {
		case null:
		case undefined:
			return renders.load?.() || null;
		case true:
			renderedPage = renders.dest();
			break;
		case false:
			renderedPage = renders.alt?.() || <></>;
			break;
	}

	return renderedPage;
};

export default useLoader;
