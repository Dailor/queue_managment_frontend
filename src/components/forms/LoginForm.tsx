import React, {useState} from 'react'

import {Box, Button, TextField} from "@mui/material"

import {useFormik} from 'formik'
import * as yup from 'yup'
import axios from "axios"
import {AuthEndpointAPI} from "@/apiEndpoints"
import {useAuth} from "@/providers/AuthProvider"
import {FetchingButton} from "@/components/FetchingButton"

interface ILoginRequest {
    email: string
    password: string
}

const loginRequest = (data: ILoginRequest) => {
    return axios.post(AuthEndpointAPI.login, data)
}

const validationSchema = yup.object({
    email: yup
        .string('Введите вашу почту')
        .email('Вы неправильно ввели почту')
        .required('Введите почту'),
    password: yup
        .string('Введите пароль')
        .min(6, 'Пароль должен содержать 6 символов')
        .required('Введите пароль'),
})

export const LoginForm = () => {
    const {setAuth} = useAuth()
    const [isFetching, toggleIsFetching] = useState<boolean>(false)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            toggleIsFetching(true)

            loginRequest(values)
                .then((r) => {
                    const {accessToken, refreshToken} = r.data
                    setAuth(accessToken, refreshToken)
                })
                .catch(e => {
                    if (e.response?.status == 422) {
                        formik.setErrors({
                            password: e.response.data.detail
                        })
                    } else {
                        formik.setErrors({
                            password: 'Ошибка на сервере, попробуйте позже'
                        })
                    }
                })
                .finally(() => {
                    toggleIsFetching(false)
                })
        },
    })

    return (
        <Box>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    sx={{marginBottom: 1}}
                    id="email"
                    label="Почта"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={!!formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email || ' '}
                />
                <TextField
                    fullWidth
                    sx={{marginBottom: 1}}
                    type='password'
                    id="password"
                    label="Пароль"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={!!formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password || ' '}
                />
                <FetchingButton variant='contained' color='primary' type="submit" isFetching={isFetching}
                                fullWidth>Войти</FetchingButton>
            </form>
        </Box>
    )
}