import React from 'react';
import styles from './login.module.css'
import {Field, Form, Formik} from "formik";
import * as yup from "yup";
import {authSetLoginUserThunk} from "../../redux/authReducer";
import {connect} from "react-redux";
import {Navigate} from "react-router-dom";
import {createField} from "../../assets/assetsForm";

const LoginFormik = ({pushLogin}) => {
    const validationForm = yup.object().shape({
        email: yup.string().email('Введите корректный email').required('Обязательно для заполнения'),
        password: yup.string().required('Обязательно для заполнения')
    })

    return (
        <Formik
            initialValues={{
                email: '',
                password: '',
                rememberMe: true
            }}
            validateOnBlur
            onSubmit={(values) => {
                pushLogin(values)
            }}
            validationSchema={validationForm}
        >
            {({
                  values, errors, touched,
                  handleChange, handleBlur, isValid,
                  handleSubmit, dirty
              }) => (
                <Form className={styles.form_login}>
                    <div className={styles.row}>
                        <label htmlFor={'email'}>Email</label><br/>
                        {createField(styles.input, 'text', 'email', handleChange, handleBlur, values.email)}
                    </div>
                    {touched.email && errors.email && <p className={styles.error}>{errors.email}</p>}
                    <div className={styles.row}>
                        <label htmlFor={'password'}>Пароль</label><br/>
                        {createField(styles.input, 'password', 'password', handleChange, handleBlur, values.password)}
                    </div>
                    {touched.password && errors.password && <p className={styles.error}>{errors.password}</p>}
                    <div className={styles.row}>
                        <label>
                            <Field
                                type="checkbox"
                                name={'rememberMe'}
                                className={styles.checkbox}
                            /> Запомнить меня
                        </label>
                        {values.rememberMe}
                    </div>
                    <div className={styles.row}>
                        <button
                            className={styles.btn}
                            disabled={!isValid && !dirty}
                            onClick={handleSubmit}
                            type={"submit"}
                        >Вход
                        </button>
                    </div>
                </Form>
            )
            }
        </Formik>
    )
}

const Login = ({isAuthUser, authSetLoginUserThunk}) => {
    const pushLogin = (values) => {
        let {email, password, rememberMe = true, captcha = false} = values
        authSetLoginUserThunk({email, password, rememberMe, captcha})
    }

    if (isAuthUser) {
        return <Navigate to={'/profile'}/>
    }

    return (
        <div>
            <h1>Войти</h1>
            <LoginFormik pushLogin={pushLogin}/>
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        isAuthUser: state.authReducer.isAuthUser

    }
}

export default connect(mapStateToProps, {authSetLoginUserThunk})(Login);