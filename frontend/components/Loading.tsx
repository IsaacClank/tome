import styles from './Loading.module.scss';

const Loading = () => {
	return (
		<div id={styles.Content}>
			<div>
				<img src='/loading.gif' alt='' />
			</div>
		</div>
	);
};

export default Loading;
