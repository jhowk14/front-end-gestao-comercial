'use client'
import React, { useCallback, useState, useEffect } from 'react';
import Modal from 'react-modal';
import {AiOutlineEdit} from 'react-icons/ai'
import {AiOutlineDelete} from 'react-icons/ai'
import {MdOutlineAddShoppingCart} from 'react-icons/md'

import axios from 'axios';

interface FormData {
  descricao: string;
  nome: string;
  precoUnitario: string; // Alterado para string
}

interface ProdutoData extends FormData {
  id: string;
}

export default function Produtos() {
  const [modalAddIsOpen, setModalAddIsOpen] = useState<boolean>(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState<boolean>(false);
  const [modalExcludeIsOpen, setModalExcludeIsOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<ProdutoData | null>(null);
  const [data, setData] = useState<ProdutoData[]>([]);
  const [formData, setFormData] = useState<FormData>({
    descricao: '',
    nome: '', // Adicionado campo "nome"
    precoUnitario: '', // Alterado para string
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get<ProdutoData[]>('http://localhost:3000/produto');
        setData(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
      }
    }

    fetchData();
  }, []);

  // Restante do código permanece o mesmo
  const handleSubmitAdicionar = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      const response = await axios.post<ProdutoData>('http://localhost:3000/produto', {
        precoUnitario: parseFloat(formData.precoUnitario),
        nome: formData.nome,
        descricao: formData.descricao
      });

      setData((prevData) => [...prevData, response.data]);
      closeModalAdd();
      setFormData({
        descricao: '',
        nome: '', // Adicionado campo "nome"
        precoUnitario: '', // Alterado para string
      })
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  }, [formData]);

  const handleSubmitEditar = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUser) {
      return;
    }

    try {
      await axios.put(`http://localhost:3000/produto/${editingUser.id}`, {
        precoUnitario: parseFloat(editingUser.precoUnitario),
        nome: editingUser.nome,
        descricao: editingUser.descricao
      });

      setData((prevData) => prevData.map((item) => (item.id === editingUser.id ? editingUser : item)));

      closeModalEdit();
    } catch (error) {
      console.error('Erro ao editar produto:', error);
    }
  }, [editingUser]);

  const handleExcluir = useCallback(async () => {
    if (!editingUser) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/produto/${editingUser.id}`);

      setData((prevData) => prevData.filter((item) => item.id !== editingUser.id));

      setModalExcludeIsOpen(false);
    } catch (error) {
      alert("Erro ao Excluir a registros vinculados ao produto");
    }
  }, [editingUser]);

  const handleChangeAdicionar = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    },
    []
  );

  const handleChangeEditar = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEditingUser((prevData: any) => ({
        ...prevData,
        [name]: value,
      }));
    },
    []
  );

  const openModalAdd = () => {
    setModalAddIsOpen(true);
  };

  const closeModalAdd = () => {
    setModalAddIsOpen(false);
  };

  const openModalEdit = (user: ProdutoData) => {
    setEditingUser(user);
    setModalEditIsOpen(true);
  };

  const closeModalEdit = () => {
    setModalEditIsOpen(false);
  };

  return (
    <>
      <header className="bg-green-500 py-4 text-white text-center">
        <h1 className="text-2xl font-bold">Produtos</h1>
      </header>
      <div className="container mx-auto p-4 rounded-lg shadow-xl bg-gray-200 m-10 shadow-gray-400">
        

        <button onClick={openModalAdd} className="bg-green-500 justify-end hover:bg-blue-700 text-white flex items-center gap-1 font-bold py-2 px-4 rounded mb-4">
            Adicionar Novo 
            <MdOutlineAddShoppingCart size={25}/>
        </button>
        <Modal
        isOpen={modalAddIsOpen}
        onRequestClose={closeModalAdd}
        contentLabel="Adicionar Novo Produto"
        // Add Tailwind classes to style the modal container
        className="absolute inset-1/4 bg-white w-1/2 p-4 rounded-lg shadow-xl"
        // Add Tailwind classes to style the overlay
        overlayClassName="fixed inset-0 bg-gray-500 opacity-95"
      >
        <h2 className="text-2xl font-bold mb-4">Adicionar Novo Produto</h2>
        <form onSubmit={handleSubmitAdicionar}>
          <div className="mb-4">
            <label htmlFor="descricao" className="block font-bold">Descricao:</label>
            <input
              id="descricao"
              name="descricao"
              type="text"
              required
              value={formData.descricao}
              onChange={handleChangeAdicionar}
              className="w-full px-3 py-2 border rounded"
              // Add more classes as needed
            />
          </div>
          <div className="mb-4">
            <label htmlFor="precoUnitario" className="block font-bold">Preço Unitario:</label>
            <input
              id="precoUnitario"
              name="precoUnitario"
              type="number"
              required
              value={formData.precoUnitario}
              onChange={handleChangeAdicionar}
              className="w-full px-3 py-2 border rounded"
              // Add more classes as needed
            />
          </div>
          <div className="mb-4">
            <label htmlFor="nome" className="block font-bold">Nome:</label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              value={formData.nome}
              onChange={handleChangeAdicionar}
              className="w-full px-3 py-2 border rounded"
              // Add more classes as needed
            />
          </div>
          <div className='flex justify-center m-5'>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4' type="submit">
              Salvar
            </button>
            <button onClick={closeModalAdd} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" type="button">
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={modalExcludeIsOpen}
        onRequestClose={() => setModalExcludeIsOpen(false)}
        contentLabel="Excluir Produto"
        // Add Tailwind classes to style the modal container
        className="bg-white p-4 rounded-lg shadow-xl"
        // Add Tailwind classes to style the overlay
        overlayClassName="fixed inset-0 flex justify-center items-center bg-gray-500 opacity-95"
      >
        <div className='flex p-5'>
        <h1>Tem certeza que deseja excluir? </h1>
        </div>
        <div className='flex justify-center items-center p-2'>
            <button onClick={handleExcluir} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4' type="button">
              Excluir
            </button>
            <button onClick={()=>setModalExcludeIsOpen(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button">
              Cancelar
            </button>
        </div>
        
      </Modal>

      <Modal
          isOpen={modalEditIsOpen}
          onRequestClose={closeModalEdit}
          contentLabel="Editar Produto"
          className="absolute inset-1/4 bg-white w-1/2 p-4 rounded-lg shadow-xl"
          overlayClassName="fixed inset-0 bg-gray-500 opacity-95"
        >
          <h2 className="text-2xl font-bold mb-4">Editar Produto</h2>
          <form onSubmit={handleSubmitEditar}>
            <div className="mb-4">
              <label htmlFor="descricao" className="block font-bold">
                Descrição:
              </label>
              <input
                id="descricao"
                name="descricao"
                type="text"
                required
                value={editingUser ? editingUser.descricao : ''}
                onChange={handleChangeEditar}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="precoUnitario" className="block font-bold">
                Preço Unitario:
              </label>
              <input
                id="precoUnitario"
                name="precoUnitario"
                type="number"
                required
                value={editingUser ? editingUser.precoUnitario : ''}
                onChange={handleChangeEditar}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="nome" className="block font-bold">
                Nome:
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                value={editingUser ? editingUser.nome : ''}
                onChange={handleChangeEditar}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex justify-center m-5">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                type="submit"
              >
                Salvar
              </button>
              <button
                onClick={closeModalEdit}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                type="button"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      
        <div className="overflow-x-auto">
  <table className="w-full border border-collapse">
    <thead>
      <tr>
        <th className="border p-2 text-left">ID</th>
        <th className="border p-2 text-left">Nome</th>
        <th className="border p-2 text-left">Descrição</th>
        <th className="border p-2 text-left">Preço Unidade</th>
        <th className="border p-2 text-center">Ações</th>
      </tr>
    </thead>
    <tbody>
      {data.map((datas) => (
        <tr key={datas.id}>
          <td className="py-2 px-4 text-left">{datas.id}</td>
          <td className="py-2 px-4 text-left">{datas.nome}</td>
          <td className="py-2 px-4 text-left">{datas.descricao}</td>
          <td className="py-2 px-4 text-left">{datas.precoUnitario}</td>
          <td className="py-2 px-4 flex justify-center">
            <button onClick={() => openModalEdit(datas)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 flex items-center gap-1 rounded mr-2">
              Editar
              <AiOutlineEdit size={25} />
            </button>
            <button onClick={() => {
              setModalExcludeIsOpen(true);
              setEditingUser(datas);
            }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 flex items-center gap-1 rounded">
              Excluir
              <AiOutlineDelete size={25} />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        </div>
    </>
  )
}
