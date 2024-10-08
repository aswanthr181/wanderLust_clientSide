interface ModalType {
    setIsModalOpen: (isModalOpen: boolean) => void
    handleAction: () => void
    modalData: { text: string, action: string }
    icon: React.ReactNode
}
function ModalAction({ setIsModalOpen, handleAction, modalData, icon }: ModalType) {
    return (
        <div className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover" id="modal-id">
            <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
            <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
                <div className="">
                    <div className="text-center p-5 flex-auto justify-center">
                        <div className="w-16 h-16 flex items-center justify-center text-red-500 mx-auto">
                            {icon}
                        </div>
                        <h2 className="text-xl font-bold py-4 ">Are you sure?</h2>
                        <p className="text-sm text-gray-500 px-8">{modalData.text} </p>
                    </div>
                    <div className="p-3  mt-2 text-center space-x-4 md:block">
                        <button onClick={() => setIsModalOpen(false)} className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">
                            Cancel
                        </button>
                        <button onClick={handleAction} className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600">{modalData.action}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalAction