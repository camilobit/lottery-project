'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { FaLinkedin, FaGithub, FaWhatsapp } from 'react-icons/fa'
import camiloFoto from '../../assets/perfilImage.jpeg'

export default function AboutMe() {
  const [open, setOpen] = useState(true)

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-1000 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <TransitionChild>
                <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <DialogTitle className="text-base font-semibold leading-6 text-gray-900">Gracias por Apoyar esta Rifa</DialogTitle>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6 flex flex-col items-center">
                  {/* Imagen de perfil */}
                  
                  {/* Texto de presentación */}
                <div className="text-center max-w-2xl">
                  <p className="text-gray-900 text-lg mb-4 font-semibold">
                    ¡Bienvenido! 🙌  
                  </p>
                  <p className="text-gray-900 text-lg mb-4">
                    Gracias por apoyar esta iniciativa. Tu aporte es muy valioso y hace posible que este proyecto siga adelante.  
                  </p>
                  <p className="text-gray-900 text-lg mb-4">
                    Aquí podrás ver los números disponibles para participar en el sorteo y encontrarás las instrucciones para unirte fácilmente.  
                  </p>
                  <p className="text-gray-900 text-lg font-medium">
                    ¡Mucha suerte y gracias por tu apoyo! 🍀
                  </p>
                </div>
                {/* Iconos de redes sociales */}
                <div className="flex space-x-4 mt-6 justify-center">
                  <a 
                    href="https://www.linkedin.com/in/camilo-acevedo/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-700 hover:text-gray-900 transition"
                  >
                    <FaLinkedin size={30} />
                  </a>
                  <a 
                    href="https://github.com/camilobit" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-700 hover:text-gray-900 transition"
                  >
                    <FaGithub size={30} />
                  </a>
                  <a 
                    href="https://wa.me/qr/LOCPNV72ZSSCG1" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-700 hover:text-gray-900 transition"
                  >
                    <FaWhatsapp size={30} />
                  </a>
                </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}



