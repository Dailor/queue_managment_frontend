import React, {useEffect} from 'react'

import {css} from '@emotion/react'

import Head from 'next/head'
import {Box, Button, Grid, Typography, useTheme} from "@mui/material"
import {FaMicrosoft} from "react-icons/fa"
import Image from "next/image"

import logo from '/public/logo.png'
import {LoginForm} from "@/components/forms/LoginForm"

export default function LoginPage() {
    return (
        <>
            <Head>
                <title>Вход</title>
            </Head>
            <Grid container sx={{
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Grid item xs={10} md={4} sx={{
                    overflow: 'hidden',
                    paddingBottom: 4,
                    borderRadius: 3,
                    boxShadow: 2,
                    backgroundColor: '#fff',
                    textAlign: 'center'
                }}>
                    <Box sx={{marginBottom: 1, paddingY: 2, backgroundColor: '#b1040e'}}>
                        <Image src={logo} alt="IITU Logo" width={211} height={32}/>
                    </Box>
                    <Box sx={{paddingX: 4}}>
                        <Typography variant='h4' sx={{fontWeight: 600, marginBottom: 6}}>Admission Queue</Typography>
                        <LoginForm/>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}
