import React, {useEffect, useMemo, useState} from 'react'
import Head from "next/head"
import {
    Box, Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Modal,
    ModalProps,
    Select,
    Typography
} from "@mui/material"

import {SkeletonPlaceHolderWrapper} from "@/components/SkeletonPlaceHolderWrapper"
import {queueListRequest} from "@/requests/queue"
import {FetchingButton} from "@/components/FetchingButton"
import {bookQueueRequest} from "@/requests/ticket"
import {getLocalUniqueID} from "@/utilities/uniqueDevice"
import Router, {useRouter} from "next/router"


const NOT_SELECTED_QUEUE_MSG = 'Вы не выбрали очередь'


interface ConfirmQueueModalProps {
    open: boolean
    handleClose: ModalProps['onClose']
    handleConfirm: Function
    handleCancel: Function
    previousQueue: Queue
}

type ObjectIdToQueueType = Record<number, Queue>

function ConfirmQueueModal({open, handleClose, handleConfirm, handleCancel, previousQueue}: ConfirmQueueModalProps) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal confirm queue"
            aria-describedby="modal for confirm queue"
        >
            <Box sx={(theme) => ({
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 280,
                bgcolor: 'background.paper',
                boxShadow: theme.shadows[5],
                p: 3,
            })}>
                <Box sx={{mb: 2}}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Подтверждение
                    </Typography>
                </Box>
                <Box sx={{mb: 3}}>
                    <Box>
                        <Typography>
                            Вы прошли этап:
                        </Typography>
                    </Box>
                    <Typography id="modal-modal-description">
                        {previousQueue.name}?
                    </Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'end'}}>
                    <Button variant='contained' sx={{mr: 1}} onClick={() => handleConfirm()}>Да</Button>
                    <Button variant='contained' onClick={() => handleCancel()}>Нет</Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default function Book() {
    const router = useRouter()

    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [queuesList, setQueuesList] = useState<Queue[]>([])

    const objectIdToQueue = useMemo<ObjectIdToQueueType>(() => {
        const r: ObjectIdToQueueType = {}

        queuesList.map((queue) => {
            r[queue.id] = queue
        })

        return r
    }, [queuesList])

    const [isModalOpened, toggleIsModalOpened] = useState(false)

    const [queueSelectedId, setQueueSelectedId] = useState<Queue['id'] | null>(null)
    const [error, setError] = useState<string>()

    const [previousQueue, setPreviousQueue] = useState<Queue | null>(null)

    const [isFetching, setIsFetching] = useState<boolean>(false)

    const submit = () => {
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
            .catch((e) => {
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

    const onConfirmPress = () => {
        if (queueSelectedId === null) {
            return setError(NOT_SELECTED_QUEUE_MSG)
        }

        const selectedQueue = objectIdToQueue[queueSelectedId]

        if (selectedQueue.previousQueueId !== null) {
            toggleIsModalOpened(true)
            setPreviousQueue(objectIdToQueue[selectedQueue.previousQueueId])
        } else {
            submit()
            setPreviousQueue(null)
        }
    }

    const onConfirmPressModal = () => {
        submit()
        toggleIsModalOpened(false)
    }

    const onModalClose = () => {
        setError("Пройдите сначало: " + previousQueue?.name)
        toggleIsModalOpened(false)
        setQueueSelectedId(null)
        setPreviousQueue(null)
    }

    const onChange = (e: CustomSyntheticEvent) => {
        setError(undefined)
        setQueueSelectedId(e.target.value)
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
            {(isModalOpened && previousQueue !== null) && (
                <ConfirmQueueModal
                    open={isModalOpened}
                    handleConfirm={onConfirmPressModal}
                    handleCancel={onModalClose}
                    handleClose={onModalClose}
                    previousQueue={previousQueue}/>
            )}
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
                                        <MenuItem value={queueItem.id} key={queueItem.id} sx={{whiteSpace: 'normal'}}>{queueItem.name}</MenuItem>
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
                                            onClick={onConfirmPress}>Отправить</FetchingButton>
                        </SkeletonPlaceHolderWrapper>
                    </Box>
                </Grid>
            </Grid>

        </>
    )
}