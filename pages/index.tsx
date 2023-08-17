import Head from 'next/head'
import React, { useState, useEffect, FormEvent, CSSProperties } from 'react'
import { toast } from 'react-toastify'
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import { motion } from "framer-motion";


export default function Home() {

  const [searchTerm, setSearchTerm] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    localStorage.clear()
  }, [])


  let header: CSSProperties = {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    fontWeight: "600 !important",
    color: "#333",
    flexDirection: "column"
  }

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm === undefined || searchTerm.length === 0) {
      toast.error('Empty field', {
        theme: "light",
        autoClose: 3000
      })
    }
    else {
      router.prefetch(`/search?q=${searchTerm}`)
      router.push(`/search?q=${searchTerm}`)
      router.events.on('routeChangeStart', () => {
        setButtonClicked(true)
      })
    }
  };
  return (
    <>
      <Head>
        <title>Indian Recipe Finder</title>
        <meta name="description" content="Search Indian Recipes as you like we have over 7000 indian recipes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <motion.div
        className="container-fluid py-3 main"
        style={header}
        initial={{ opacity: 0, x: "-100%" }}
        animate={buttonClicked ? { opacity: 0, x: "100%" } : { opacity: 1, x: 0 }}
        exit={buttonClicked ? { opacity: 0, x: "100%" } : { opacity: 1, x: 0 }}
      >
        <div className="flex h-full">
          <div className="col-12 my-auto">
            <h1 className="text-center text-3xl xl:text-4xl mb-4">Indian Recipe Finder</h1>
            <p className="text-center">Discover endless flavor with over 7000+ delicious recipes, just waiting to be found.</p>
            <form className="mt-5 search-container" onSubmit={handleSearch}>
              <input
                type="text"
                className="form-control search-bar focus:outline-none focus:ring-2 focus:ring-blue-50"
                placeholder="Search for recipes..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <button type="submit" style={{ border: "none", outline: "none", borderRadius: "50%" }}><i
                className="fas fa-search search-icon"
              ></i></button>
            </form>
          </div>
        </div>
        <Footer />
      </motion.div>
    </>
  )
}
