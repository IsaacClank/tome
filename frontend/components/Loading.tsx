import styles from './Loading.module.scss';

const Loading = () => {
	return (
		<div id={styles.Container}>
			<div>
				<img src='/loading1.gif' alt='' />
			</div>
		</div>
	);
};

export default Loading;
