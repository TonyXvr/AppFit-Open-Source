import styles from './styles.module.scss';

const BackgroundRays = () => {
  return (
    <div className={`${styles.rayContainer} `}>
      <div className={`${styles.lightRay} ${styles.ray1}`}></div>
      <div className={`${styles.lightRay} ${styles.ray2}`}></div>
    </div>
  );
};

export default BackgroundRays;
