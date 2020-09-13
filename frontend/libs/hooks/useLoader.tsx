import { useEffect, useState } from 'react';

interface IRenderOptions {
	dest: () => JSX.Element;
	alt?: () => JSX.Element;
	load?: () => JSX.Element;
}

const useLoader = (condition: boolean, renders: IRenderOptions) => {
	const [renderCondition, setRenderCondition] = useState(condition);
	let renderedPage = <></>;
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
