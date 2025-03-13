import React from 'react'
import Form from '../components/Form'

const login = () => {
  return (
    <Form route="api/token/" method="login" />
  )
}

export default login 