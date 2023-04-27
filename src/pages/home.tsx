// export default Page
import Head from "next/head";
import styles from '@/styles/home.module.scss'

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.msg}>This is Homepage</h1>
    </>
  );
}
