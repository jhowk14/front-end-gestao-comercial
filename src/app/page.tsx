'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { BsFillPersonFill } from 'react-icons/bs';
import { IoPricetagSharp } from 'react-icons/io5';
import { FiHome } from 'react-icons/fi';

type Pedido = {
  id: number;
  valorTotal: number;
  clienteId: number;
  cliente: {
    nome: string;
  };
  itensPedido: ItensPedido[];
};

type ItensPedido = {
  id: number;
  pedidoId: number;
  produtoId: number;
  quantidade: number;
  produto: {
    nome: string;
  };
  valorTotal: number;
};

const Home = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const apiPedidos = async () => {
      try {
        const response = await axios.get<Pedido[]>('http://localhost:3000/pedido');
        setPedidos(response.data);
      } catch (e) {
        console.error(e);
      }
    };

    apiPedidos();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-green-500 py-4 text-white text-center">
        <h1 className="text-2xl font-bold">
          Bem-vindo ao Gerenciamento Comercial
        </h1>
      </header>
      <main className="container mx-auto grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 p-8">
        {pedidos.map((pedido) => (
          <div
            key={pedido.id}
            className="bg-gray-200 shadow-lg rounded-lg p-4 m-4"
          >
            <h2 className="text-xl font-semibold">
              <AiOutlineShoppingCart className="inline-block text-2xl text-green-500 mr-2" />
              Pedido ID: {pedido.id}
            </h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h2 className="text-xl font-semibold">
                  <BsFillPersonFill className="inline-block text-2xl text-blue-500 mr-2" />
                  Cliente:
                </h2>
                <p className="text-lg font-medium">
                  Nome: {pedido.cliente.nome}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold">
                  Total: <IoPricetagSharp className="inline-block text-2xl text-red-500 mr-2" />
                </p>
                <p className="text-2xl text-green-600 font-semibold">
                  R$ {pedido.valorTotal.toFixed(2)}
                </p>
              </div>
            </div>
            <div
              className="mt-4"
              style={{ maxHeight: '400px', overflowY: 'auto' }}
            >
              <h3 className="text-xl font-semibold">
                
                Produtos:
              </h3>
              {pedido.itensPedido.map((produto) => (
                <div
                  key={produto.id}
                  className="bg-white p-2 rounded-lg shadow-md mt-2"
                >
                  <p className="text-lg font-semibold">
                    ID: {produto.produtoId}
                  </p>
                  <p className="text-lg font-semibold">
                    Nome: {produto.produto.nome}
                  </p>
                  <p className="text-lg">Quantidade: {produto.quantidade}</p>
                  <p className="text-lg text-green-400 font-semibold">
                    Total: R$ {produto.valorTotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Home;
