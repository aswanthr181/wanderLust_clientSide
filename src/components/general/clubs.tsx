import axios from "axios"
import  { useEffect, useState } from "react"
import { serverApi } from "../../constants/api"
import { useNavigate } from "react-router-dom"
import { useAppUseSelector } from "../../store/hooks"
import { calculateDistance } from "../../constants/functions/calculateDistance"
import ModalAction from "./modals/actionModal"
import ClipLoaders from "./loader/clipLoader"
import Empty from "./empty"

interface type {
    name: string,
    place: string,
    logo: string,
    id: string,
    isMemberOrAdmin: boolean
    members:number
    admin:string
}

interface memberType {
    email: string,
    member: string,
    _id: string
}

export interface clubType {
    _id: string
    clubName: string
    admin: string
    logo: string
    location: {
        place: string
        longitude: number
        latitude: number
    }
    members: {
        email: string
        member: string
        _id: string
    }[]
}
const modalData = {
    text: 'Are you sure want to join ',
    action: 'JOIN'
}
const Club = ({ name, place, logo, id, isMemberOrAdmin,members,admin }: type) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const { email } = useAppUseSelector((state) => state.user)
    const navigate = useNavigate()
    console.log(id, 'comppp');

    const handleJoin = async () => {
        setIsModalOpen(true)
    }
    const hanleAction = async () => {
        try {
            if (email) {
                const response = await axios.post(`${serverApi}/join`, { id, email })
                if (response.status === 200) {
                    navigate(`/clubDetail/${id}`)
                }
                console.log(response, 'resss');

            }
        } catch (error) {

        }
    }

    return (
        <>
            <div className="w-full m-3 shadow-lg text-black flex flex-col gap-2 p-2">
                <div className="flex justify-evenly w-full col-span-1 h-full p-2 rounded-lg hover:shadow-lg">
                    <div className="w-4/12 rounded-full me-1 flex items-center overflow-hidden">
                        <img
                            src={logo ? logo

                                : "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80"
                            }
                            className="w-40 h-40 rounded-full object-cover "
                            alt="..."
                        />
                    </div>
                    <div className=" w-8/12 flex items-center justify-evenly ">
                        <div className="w-full flex  justify-between items-center  ">
                            <div className=" flex-row items-center ">
                                <h5 className="font-medium capitalize">{name}</h5>
                                <p className="capitalize">City : {place}</p>
                                <p className="">
                                    Total Members : {members}
                                </p>
                                
                                <p className="">Admin : {admin} </p>
                            </div>


                        </div>
                    </div>

                    {isModalOpen && <ModalAction setIsModalOpen={setIsModalOpen} handleAction={hanleAction} modalData={modalData} icon='' />}
                </div>
                <div className='flex'>
                    {isMemberOrAdmin ? <button onClick={() => navigate(`/clubDetail/${id}`)}
                        className="bg-orange-400 text-white px-3 h-1/3 rounded  hover:bg-orange-600 hover:text-white py-1 transition-all duration-300 ease-in-out w-full"
                    >View</button> : <button
                        onClick={() => email ? handleJoin() : ''}
                        className="bg-orange-300 text-white px-3 rounded  hover:bg-orange-400 hover:text-white py-1 transition-all duration-300 ease-in-out w-full"
                    >
                        Join
                    </button>}

                </div>
            </div>

        </>
    )
}

const Clubs = () => {
    const [clubs, setClubs] = useState<clubType[]>([])
    const [latitude, setLatitude] = useState<any>()
    const [longitude, setLlongitude] = useState<any>()
    const [loading, setLoading] = useState<boolean>(true)
    const { email } = useAppUseSelector((state) => state.user)

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLatitude(position.coords.latitude)
                setLlongitude(position.coords.longitude)
            })
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }, [])

    useEffect(() => {
        const getClub = async () => {
            try {
                const response = await axios.get(`${serverApi}/getClubs`)
                console.log(response.data.data)
                setClubs(response.data.data)
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }
        getClub()
    }, [])
    const handleMyClubs = () => {
        if (email) {
            const filtered = clubs.filter((club) => {
                return club.admin === email || club.members.some((member: memberType) => member.email === email);
            })
            setClubs(filtered)
        }
    }
    const FilterBy = () => {
        if (longitude && latitude) {
            const filteredClubs = clubs.filter((club) => {
                const distance = calculateDistance(
                    latitude,
                    longitude,
                    club.location.latitude,
                    club.location.longitude
                )
                console.log(Math.floor(distance), '100')
                return Math.floor(distance) <= Math.floor(100)
            })
            setClubs(filteredClubs)
        } else {
            console.log('Geolocation is not available');

        }

    }
    const handleSearch = (text: string) => {
        let searchItem = []
        searchItem = clubs.filter((club) => {
            return club.clubName.toLocaleLowerCase().includes(text.toLocaleLowerCase())
        })
        setClubs(searchItem)
    }


    return (
        <>{
            !loading ?

                <div className="mt-10 overflow-hidden ">
                    <div className=" ">
                        <div className='flex justify-center  space-x-1'>
                            <input
                                type="search"
                                onChange={(e) => handleSearch(e.target.value)}
                                className="block w-full md:w-[20rem] px-4 py-2 text-black bg-white border rounded-full focus:border-slate-800 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                placeholder="Search..."
                            />
                        </div>

                        <div className="sm:w-full mt-14 md:px-20 flex justify-end  mb-2 gap-3">
                            <button onClick={handleMyClubs} className="p-2 w-1/2 md:w-40 text-white bg-black hover:bg-slate-700 rounded-lg ">
                                My Clubs
                            </button>
                            <button onClick={FilterBy} className="p-2 w-1/2 md:w-40 text-white bg-black hover:bg-slate-700 rounded-lg ">
                                My Location
                            </button>
                        </div>
                        <div className=" grid md:grid-cols-2 grid-cols-1 gap-4 mr-5 md:px-14">

                            {clubs.length > 0 ? clubs.map((club) => {
                                const isMemberOrAdmin = club.admin === email || club.members.some((member: memberType) => member.email === email);
                                return (
                                    <>
                                        <div key={club._id}>
                                            <Club admin={club.admin} name={club.clubName} place={club.location.place} logo={club.logo} id={club._id} isMemberOrAdmin={isMemberOrAdmin} members={club.members.length}  />
                                        </div>
                                    </>
                                )
                            }) : <div>
                                <Empty message='No Results found' />
                            </div>} </div>
                    </div>
                </div>
                :
                <ClipLoaders loading={loading} />
        }
        </>
    )
}
export default Clubs
