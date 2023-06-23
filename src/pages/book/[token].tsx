import React, {useEffect, useState} from 'react'
import Head from "next/head"
import {Box, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Typography} from "@mui/material"

import {SkeletonPlaceHolderWrapper} from "@/components/SkeletonPlaceHolderWrapper"
import {queueListRequest} from "@/requests/queue"
import {FetchingButton} from "@/components/FetchingButton"
import {bookQueueRequest} from "@/requests/ticket"
import {getLocalUniqueID} from "@/utilities/uniqueDevice"
import Router, {useRouter} from "next/router"


const NOT_SELECTED_QUEUE_MSG = 'Вы не выбрали очередь'

export default function Book() {
    const router = useRouter()

    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [queuesList, setQueuesList] = useState<Queue[]>([])

    const [queueSelectedId, setQueueSelectedId] = useState<Queue['id'] | null>(null)
    const [error, setError] = useState<string>()

    const [isFetching, setIsFetching] = useState<boolean>(false)

    const validate = () => {
        return !!queueSelectedId
    }

    const onChange = (e: CustomSyntheticEvent) => {
        setError(undefined)
        setQueueSelectedId(e.target.value)
    }

    const onSubmit = () => {
        if(!validate()){
            return setError(NOT_SELECTED_QUEUE_MSG)
        }

        const token = router.query.token as string

        setIsFetching(true)

        bookQueueRequest({
            uniqueId: getLocalUniqueID(),
            queueId: queueSelectedId as number,
            token
        })
            .then(() => {
                void Router.push('/ticket/' + token)
            })
            .catch((e)=> {
                if (e.response?.status == 400) {
                    setError(e.response.data.error)
                } else {
                    setError('Ошибка при выполнении запроса')
                }
            })
            .finally(() => {
                setIsFetching(false)
            })
    }

    useEffect(() => {
        queueListRequest()
            .then(r => {
                setQueuesList(r.data.queues)
            })
            .finally(() => {
                setIsLoaded(true)
            })
    }, [])

    return (
        <>
            <Head>
                <title>Выбор очереди</title>
            </Head>
            <Grid container sx={{height: '100%', justifyContent: 'center', paddingTop: '5vh'}}>
                <Grid item xs={12} sm={8} md={5} lg={4}
                      sx={{
                          paddingTop: 3,
                          paddingBottom: 6,
                          px: 2,
                          borderRadius: 5,
                          bgcolor: '#FFFFFF',
                          textColor: '#3B3B3B',
                      }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 0.7
                    }}>
                        <SkeletonPlaceHolderWrapper
                            isReady={isLoaded}
                            skeletonProps={{
                                variant: 'text', sx: {
                                    fontSize: 28,
                                    width: 120
                                }
                            }}>
                            <Typography sx={{fontSize: 28, fontWeight: '800', marginRight: 1}}>
                                Выберите очередь
                            </Typography>
                        </SkeletonPlaceHolderWrapper>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 1.5
                    }}>
                        <SkeletonPlaceHolderWrapper
                            isReady={isLoaded}
                            skeletonProps={{
                                variant: 'text', sx: {
                                    fontSize: 28,
                                    width: {
                                        xs: '80%',
                                        sm: 300,
                                        md: 350
                                    }
                                }
                            }}>
                            <FormControl sx={{mt: 1}} fullWidth error={!!error}>
                                <InputLabel id="queue-select-label">Очередь</InputLabel>
                                <Select
                                    labelId="queue-select-label"
                                    id="queue-select"
                                    value={queueSelectedId}
                                    label="Очередь"
                                    onChange={onChange}
                                >
                                    {queuesList.map((queueItem) => (
                                        <MenuItem value={queueItem.id} key={queueItem.id}>{queueItem.name}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{error}</FormHelperText>
                            </FormControl>
                        </SkeletonPlaceHolderWrapper>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <SkeletonPlaceHolderWrapper
                            isReady={isLoaded}
                            skeletonProps={{
                                variant: 'text', sx: {
                                    fontSize: 28,
                                    width: {
                                        xs: '80%',
                                        sm: 300,
                                        md: 350
                                    }
                                }
                            }}>
                            <FetchingButton variant='contained' color='primary' type="submit"
                                            isFetching={isFetching}
                                            fullWidth
                                            onClick={onSubmit}>Отправить</FetchingButton>
                        </SkeletonPlaceHolderWrapper>
                    </Box>
                </Grid>
            </Grid>

        </>
    )
}