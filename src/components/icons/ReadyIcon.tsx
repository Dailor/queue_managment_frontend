import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded'
import {Box} from "@mui/material"

const ReadyIcon = () => {
    return (
        <Box sx={{display: 'flex', p: 0.5, bgcolor: '#3B3B3B', borderRadius: 9999}}>
            <DoneAllRoundedIcon sx={{color: 'white'}}/>
        </Box>
    )
}

export default ReadyIcon