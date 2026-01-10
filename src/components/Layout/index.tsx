import React from 'react'
import Header from './Header'
import Footer from './Footer'

const index = ({children}:any) => {
  return (
    <div className='max-w-[2200px] selection:bg-yellow-200 mx-auto'>
        <Header/>
        {children}
        <Footer/>
    </div>
  )
}

export default index