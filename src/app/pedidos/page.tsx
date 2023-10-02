'use client'
import { useState, useEffect } from 'react';
import {AiOutlineDelete} from 'react-icons/ai'
import {BiCartAdd} from 'react-icons/bi'
import axios from 'axios';
import { BsCartCheck, BsCartXFill } from 'react-icons/bs';

interface Produto {
  id: number;
  nome: string;
  precoUnitario: number;
}

interface Cliente {
  id: number;
  nome: string;
}

interface Item {
  produtoId: number;
  quantidade: number;
  valor: number;
}

export default function Pedidos() {
  const [clienteId, setClienteId] = useState('');
  const [data, setData] = useState('');
  const [itens, setItens] = useState<Item[]>([{ produtoId: 0, quantidade: 0, valor: 0 }]);
  const [clientesDisponiveis, setClientesDisponiveis] = useState<Cliente[]>([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<Produto[]>([]);

  const fetchProdutos = async () => {
    try {
      const produtosResponse = await axios.get('http://localhost:3000/produto');
      const clientesResponse = await axios.get('http://localhost:3000/cliente');
      setProdutosDisponiveis(produtosResponse.data);
      setClientesDisponiveis(clientesResponse.data);
    } catch (error) {
      console.error('Erro ao buscar produtos ou clientes da API:', error);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const adicionarItem = () => {
    setItens([...itens, { produtoId: 0, quantidade: 0, valor: 0 }]);
  };

  const removerItem = (index: number) => {
    const novosItens = [...itens];
    novosItens.splice(index, 1);
    setItens(novosItens);
  };

  const atualizarItem = (index: number, campo: string, valor: string) => {
    const novosItens: any = [...itens];

    if (!isNaN(parseFloat(valor))) {
      novosItens[index][campo] = parseFloat(valor);
    } else {
      novosItens[index][campo] = 0;
    }

    setItens(novosItens);
  };

  const calcularTotal = () => {
    let total = 0;
    for (const item of itens) {
      total += item.valor || 0;
    }
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pedidoData = {
      valorTotal: calcularTotal(),
      clienteId: parseInt(clienteId),
      produtos: itens.map((item) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        valor: item.valor,
      })),
    };
    console.log(pedidoData);

    try {
      await axios.post('http://localhost:3000/pedido', pedidoData);
      setClienteId('');
      setData('');
      setItens([]);
    } catch (error) {
      console.error('Erro ao enviar o pedido:', error);
      alert('Preencha todos os campos');
    }
  };

  return (
  <>
    <header className="bg-green-500 py-4 text-white text-center">
        <h1 className="text-2xl font-bold">Pedido</h1>
      </header>
<div className="container mx-auto p-8 rounded-lg shadow-xl bg-gray-200">
  <h1 className="text-3xl text-gray-600 font-mono mb-5">Cadastro de Pedidos</h1>
  <form onSubmit={handleSubmit}>
    <div className="flex flex-col md:flex-row gap-4">
      <div className="mb-4 md:w-1/2">
        <label htmlFor="clienteId" className="block text-lg font-medium text-gray-700">
          Cliente
        </label>
        <select
          id="clienteId"
          name="clienteId"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        >
          <option value="">Selecione um cliente</option>
          {clientesDisponiveis.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>
      </div>
    </div>
    <div className="mb-4">
      <label className="block text-lg font-medium text-gray-700">Itens da Venda</label>
      {itens.map((item, index) => (
        <div key={index} className="flex flex-col md:flex-row md:items-center gap-4">
          <select
            value={item.produtoId}
            onChange={(e) => atualizarItem(index, 'produtoId', e.target.value)}
            className="mt-1 p-2 border rounded-md w-full md:w-1/3"
          >
            <option value={0}>Selecione um produto</option>
            {produtosDisponiveis.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Quantidade"
            value={item.quantidade}
            onChange={(e) => {
              atualizarItem(index, 'quantidade', e.target.value);
              atualizarItem(
                index,
                'valor',
                `${produtosDisponiveis.find((v) => v.id === item.produtoId)?.precoUnitario! * item.quantidade}`
              );
            }}
            className="mt-1 p-2 border rounded-md w-full md:w-1/4"
          />
          <input
            type="text"
            placeholder="Valor Total do Item"
            value={`R$ ${(produtosDisponiveis.find((v) => v.id === item.produtoId)?.precoUnitario! * item.quantidade) || '0.00'}`}
            onChange={(e) => atualizarItem(index, 'valor', e.target.value)}
            className="mt-1 p-2 border rounded-md w-36"
            disabled
          />
          <button
            type="button"
            onClick={() => removerItem(index)}
            className="mt-2 md:mt-0 p-2 bg-red-500 text-white rounded-md text-center"
          >
            <BsCartXFill size={25}/>
          </button>
        </div>
      ))}
      <div className="mt-4 flex flex-col md:flex-row justify-start gap-4">
        <button
          type="button"
          onClick={adicionarItem}
          className="p-2 bg-green-500 text-white rounded-md flex items-center gap-1 text-center"
        >
          Adicionar <BiCartAdd size={25}/>
        </button>
        <button type="submit" className="p-2 bg-blue-500 text-white flex items-center gap-1 rounded-md text-center">
          Salvar Venda
          <BsCartCheck size={25}/>
        </button>
        <p className="mt-2 md:mt-0">Total: R$: {calcularTotal().toFixed(2)}</p>
      </div>
    </div>
  </form>
</div>

  </>
  );
}
