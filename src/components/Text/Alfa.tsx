import React from 'react'
import { Alfa_Slab_One } from "next/font/google";
const inter = Alfa_Slab_One({ weight:['400','400'],subsets:["latin"] });
const index = ({children}:any) => {
  return (
    <h2 className={inter.className}>
        {children}
    </h2>
  )
}

export default index