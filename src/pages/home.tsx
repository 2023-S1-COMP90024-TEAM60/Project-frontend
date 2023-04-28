// export default Page
import Head from "next/head";
import styles from '@/styles/home.module.scss'
import { Button } from "antd";
import axios from "axios";

export default function Home() {
  const fetchData = async () => {
    const response = await axios(`http://localhost:8000/api/v1/hello`, {
      method: 'GET',
    });
    console.log(response.data.message)
  };

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    fetchData();
  };

  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.msg}>This is Homepage</h1>
      <Button onClick={handleClick}>Click</Button>
    </>
  );
}
