// export default Page
import Head from "next/head";
import styles from '@/styles/home.module.scss'
import { Button, Input } from "antd";
import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import { getDoc } from "@/utils/api/api";

export default function Home() {
  const [value, setValue] = useState('9fbab262d880bef09aa8d47e07495055')
  const [data, setData] = useState('')
  const fetchData = async () => {
    const response = await getDoc(value)
    if (response.status === StatusCodes.OK) {
      setData(response.data);
    } else {
      setData('no data')
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.msg}>This is Homepage</h1>
      <Input placeholder="Basic usage" onChange={handleChange} defaultValue="9fbab262d880bef09aa8d47e07495055"/>
      <Button onClick={handleClick}>Click</Button>
      <div>{JSON.stringify(data)}</div>
    </>
  );
}
