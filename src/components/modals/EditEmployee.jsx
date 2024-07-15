import React, { useEffect, useState } from "react";
import { Address, EmpFormData, FormData, Office } from "../../data/Dashboard";
import { IoClose } from "react-icons/io5";

import Input from "../formField/Input";

import {
  employeeRegisterRoute,
  getAllLeaders,
  studentRegisterRoute,
  updateEmployeeRoute,
} from "../../utils/Endpoint";
import { toast } from "react-toastify";
import { EmployeeCards } from "../../data/Employee";
import ReqLoader from "../loading/ReqLoader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useSelector } from "react-redux";

const EditEmployee = ({ entityData, setData, getTableData, setModal }) => {
  const axios = useAxiosPrivate();

  const [empFormData, setEmpFormData] = useState(entityData);
  const [loader, setLoader] = useState(false);

  const [leaders, setLeaders] = useState([]);

  const offices = useSelector(state=> state?.data?.offices)

  const changeHandler = (e) => {
    const { name, value } = e.target;

    if (["houseName", "city", "state", "pin"].includes(name)) {
      setEmpFormData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [name]: value,
        },
      }));
    } else {
      setEmpFormData({
        ...empFormData,
        [name]: value,
      });
    }
  };

  // Submit Handler
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!(empFormData?.name || empFormData?.email)) return;
    try {
      setLoader(true);
      await axios
        .put(`${updateEmployeeRoute}/${entityData._id}`, empFormData)
        .then((res) => {
          console.log(res.data);
          setModal(false);
          toast.success(res?.data?.msg);
          setData({});
          getTableData();
        })
        .catch((error) => {
          console.log(error);
          toast.error(error?.response?.data?.msg);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const getLeaders = async () => {
    await axios.get(getAllLeaders)
      .then((res) => {
        setLeaders(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    getLeaders()
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-screen overflow-auto bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-white mt-60  md:mt-0 md:w-1/2 rounded-lg p-5  md:p-10 md:px-14 m-5">
        <h1 className="font-bold text-center text-xl text-primary_colors">
          Update Employee
        </h1>
        <IoClose
          onClick={() => setModal(false)}
          className="absolute right-3 top-3 rounded bg-primary_colors text-white cursor-pointer"
        />
        <div className="flex flex-col w-full mt-5">
          <form action="" onSubmit={submitHandler}>
            <div className="w-full flex flex-wrap">
              <>
                {
                  <>
                    <div className="w-full md:w-1/2 p-1 py-2">
                      <Input
                        name="name"
                        type="text"
                        changeHandler={changeHandler}
                        value={empFormData?.name}
                        placeholder="Name"
                      />
                    </div>
                    <div className="w-full md:w-1/2 p-1 py-2">
                      <Input
                        name="email"
                        type="email"
                        changeHandler={changeHandler}
                        value={empFormData?.email}
                        placeholder="Email"
                      />
                    </div>
                    <div className="w-full md:w-1/2 p-1 py-2">
                      <Input
                        name="phone"
                        type="text"
                        changeHandler={changeHandler}
                        value={empFormData?.phone}
                        placeholder="Phone"
                      />
                    </div>
                    <div className="w-full md:w-1/2 p-1 py-2">
                      <Input
                        name="password"
                        type="text"
                        changeHandler={changeHandler}
                        placeholder="New Password"
                      />
                    </div>
                    <div className="w-full md:w-1/2 p-1 py-2">
                      <Input
                        name="education"
                        type="text"
                        changeHandler={changeHandler}
                        value={empFormData?.education}
                        placeholder="Education"
                      />
                    </div>
                    <div className="w-full md:w-1/2 p-1 py-2">
                      <Input
                        name="birthDate"
                        type="date"
                        changeHandler={changeHandler}
                        value={empFormData?.birthDate?.split("T")[0]}
                        placeholder="Birth Date"
                      />
                    </div>

                    {Address.map((data) => (
                      <div key={data?.id} className="w-full md:w-1/2 p-1 py-2">
                        <Input
                          name={data?.name}
                          placeholder={data?.placeholder}
                          type={data?.type}
                          changeHandler={changeHandler}
                          value={empFormData?.address?.[data?.name]}
                        />
                      </div>
                    ))}

                    <div className="flex w-full gap-2">
                      <select
                        value={empFormData?.department}
                        className={`border border-primary_colors/50 text-gray-400 text-xs p-3 focus:outline-none w-full rounded-lg`}
                        name="department"
                        id=""
                        onChange={changeHandler}
                      >
                        <option className="" value="">
                          Select A Department
                        </option>
                        {EmployeeCards.map((items, index) => (
                          <option key={index} className="" value={items?.path}>
                            {items?.name}
                          </option>
                        ))}
                      </select>
                      <select
                        value={empFormData?.office}
                        className={`border border-primary_colors/50 text-gray-400 text-xs p-3 focus:outline-none w-full rounded-lg`}
                        name="office"
                        id=""
                        onChange={changeHandler}
                      >
                        <option className="" value="">
                          Select A office
                        </option>
                        {offices.map((items, index) => (
                          <option key={index} className="" value={items?._id}>
                            {items?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                }

                {
                  empFormData.department !== "operations"
                  &&
                  <div className="flex w-full sm:w-1/2 gap-2 mt-2">
                    <select
                      className={`border border-primary_colors/50 text-gray-400 text-xs p-3 focus:outline-none w-full rounded-lg`}
                      name="leader"
                      id=""
                      onChange={changeHandler}
                    >
                      <option className="" value="">
                        Select Leader
                      </option>
                      {leaders.map((item, index) => (
                        <option key={item._id} className="" value={item?._id}>
                          {item?.name}
                        </option>
                      ))}
                    </select>

                  </div>

                }


              </>
            </div>

            {/* BUTTON */}
            <div className="text-white text-normal space-x-3 flex items-center justify-end mt-10">
              <button
                type="submit"
                className="bg-primary_colors p-2 px-5 rounded-lg hover:scale-105 ease-in-out duration-200"
              >
                Submit
              </button>
              {/* )} */}
            </div>
          </form>
        </div>
      </div>
      {loader && <ReqLoader />}
    </div>
  );
};

export default EditEmployee;
