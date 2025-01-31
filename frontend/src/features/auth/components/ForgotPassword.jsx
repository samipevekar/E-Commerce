import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector,useDispatch } from 'react-redux'
import { resetPasswordRequestAsync, selectMailSent } from '../authSlice';

export default function ForgotPassword() {

  const mailSent = useSelector(selectMailSent)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch()

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="/ecommerce.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Enter email to reset password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            noValidate
            onSubmit={handleSubmit((data) => {
              console.log(data);
              dispatch(resetPasswordRequestAsync(data.email))
              // TODO : implementation on backend with email
            })}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                      message: 'G-mail is not valid',
                    },
                  })}
                  type="email"
                  className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
                {mailSent && (<p className="text-green-500">Mail Sent</p>)}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm bg-black hover:bg-gray-900 "
              >
                Send Email
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Send me back to{' '}
            <Link
              to="/login"
              className="font-semibold leading-6 text-black hover:text-gray-900 underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}