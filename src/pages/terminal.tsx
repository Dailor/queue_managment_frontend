import Head from "next/head"
import React, {useEffect, useRef} from "react"
import TerminalSocketService from "@/services/terminalSocket"
import {loadUserMeRequestApi} from "@/providers/AuthProvider.api"
import {getAccessTokenFromLocalStorage} from "@/utilities/jwt"

export default function TerminalPage() {
    const terminalSocketRef = useRef<TerminalSocketService>()

    useEffect(() => {
        let responseStatusOK = true

        try {
            void loadUserMeRequestApi()

        } catch (e) {
            responseStatusOK = false
        }

        if (responseStatusOK) {
            terminalSocketRef.current = new TerminalSocketService()
            terminalSocketRef.current?.init(getAccessTokenFromLocalStorage())
        }

    })

    return (
        <>
            <Head>
                <title>Терминал</title>
            </Head>
        </>
    )
}