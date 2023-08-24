import styles from './index.module.css';  //assuming you've created an index.module.css file

export default function index() {
  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={() => window.location.href = "/templates"}>
        Show template
      </button>
    </div>
  );
}

