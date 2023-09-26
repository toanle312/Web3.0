import logo from "../../images/images/logo.png";


const Loading = () => {
  return (
    <div className='flex w-full h-[100vh] min-h-screen items-center justify-center gradient-bg-welcome'>
      <div>
        <img src={logo} alt="logo-loading" />
        <div className="mt-5 animate-spin rounded-full h-28 w-28 border-b-2 border-red-700 m-auto" />
      </div>
    </div>
  )
}

export default Loading