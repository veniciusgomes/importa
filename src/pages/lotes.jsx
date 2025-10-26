import React, { useEffect, useState } from "react";
import { SideBar } from "../components/sidebar";
import Header from "../components/header";
import EditNomeLoteModal from "../components/EditNomeLoteModal";

export default function Lotes() {
  const [itensEstoque, setItensEstoque] = useState([]);
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [valorDolar, setValorDolar] = useState(0);
  const [dataLote, setDataLote] = useState("");
  const [valorCaixaUSCLOSER, setValorCaixaUSCLOSER] = useState(0);
  const [pesoCaixaUSCLOSER, setPesoCaixaUSCLOSER] = useState(0);
  const [lotes, setLotes] = useState([]);
  const [freteDeclarado, setFreteDeclarado] = useState(0);
  const [seguro, setSeguro] = useState(0);
  const [valorFrete, setValorFrete] = useState(0);
  const [importacao, setImportacao] = useState(0);
  const [icms, setIcms] = useState(0);
  const [taxasFixas, setTaxasFixas] = useState({ icms: 0, importacao: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [nomeLote, setNomeLote] = useState(""); // AJUSTE: Novo estado para o nome
  const [novoNomeLote, setNovoNomeLote] = useState("");
  const [isNomeModalOpen, setIsNomeModalOpen] = useState(false);
  const [editingLoteId, setEditingLoteId] = useState(null);
  const [openLoteId, setOpenLoteId] = useState(null);

  console.log(isLoading)
  useEffect(() => {
    loadEstoque();
    loadLotes();
    loadConfig();
  }, []);

  function formatarDataBR(dataString) {
    if (!dataString) return "N/A";
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  const loadEstoque = async () => {
    const dados = await window.electronAPI.getItems();
    const formatado = dados.map((i) => ({
      id: i.id,
      nome: i.nome_item,
      valorCompra: i.valor_compra,
      valorDeclarado: i.valor_declarado,
      peso: i.peso,
      quantidade: i.quantidade,
      dataCompra: i.data_compra,
      taxas: i.taxas,
      valorDolar: i.valor_dolar,
    }));
    setItensEstoque(formatado);
  };

  const handleOpenNomeModal = (loteId) => {
    const loteAtual = lotes.find((l) => l.id === loteId);
    if (loteAtual) {
      setEditingLoteId(loteId);
      setNovoNomeLote(loteAtual.nome || ""); // Preenche o input com o nome atual
      setIsNomeModalOpen(true); // Abre o modal
    }
  };

  const handleSaveNovoNome = async () => {
    if (novoNomeLote === null || editingLoteId === null) return; // Checagem de segurança

    setIsLoading(true);
    try {
      await window.electronAPI.updateLoteNome(editingLoteId, novoNomeLote);
      await loadLotes(); // Recarrega os lotes para mostrar o nome novo

      // Fecha e reseta o modal
      setIsNomeModalOpen(false);
      setEditingLoteId(null);
      setNovoNomeLote("");

    } catch (error) {
      console.error("Erro ao atualizar nome:", error);
      alert("Falha ao atualizar o nome.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadConfig = async () => {
    const config = await window.electronAPI.getConfig();
    setTaxasFixas({
      icms: config.taxa_icms,
      importacao: config.taxa_importacao,
    });
  };


  const loadLotes = async () => {
    const dados = await window.electronAPI.getLotesComItens();
    const agrupado = dados.reduce((acc, row) => {
      if (!acc[row.lote_id]) {
        acc[row.lote_id] = {
          id: row.lote_id,
          nome: row.lote_nome, // <-- Novo
          data: row.data_criacao,
          dolar: row.valor_dolar,
          valorCaixa: row.valor_caixa_uscloser,
          pesoCaixa: row.peso_caixa_uscloser,
          freteDeclarado: row.frete_declarado,
          seguro: row.seguro,
          freteLote: row.frete_lote,
          valorImportacao: row.valor_importacao,
          valorICMS: row.valor_icms,
          itens: [],
        };
      }
      acc[row.lote_id].itens.push({
        id: row.item_id,
        nome: row.nome_item,
        peso: row.peso,
        quantidade: row.quantidade,
        valorCompra: row.valor_compra,
        valorDeclarado: row.valor_declarado,
      });
      return acc;
    }, {});
    const lotesArray = Object.values(agrupado);
    setLotes(lotesArray);

    // Lógica para abrir o lote correto
    const currentOpenLotExists = lotesArray.some(l => l.id === openLoteId);

    if (!currentOpenLotExists && lotesArray.length > 0) {
      // Se o lote que estava aberto foi deletado (ou é a 1ª carga),
      // abre o mais recente.
      setOpenLoteId(lotesArray[0].id);
    } else if (lotesArray.length === 0) {
      // Se não há lotes, reseta
      setOpenLoteId(null);
    }
    // Se o lote que estava aberto ainda existe, não faz nada (mantém aberto)
  };
  const toggleSelecionado = (item) => {
    if (itensSelecionados.some((i) => i.id === item.id)) {
      setItensSelecionados(itensSelecionados.filter((i) => i.id !== item.id));
    } else {
      setItensSelecionados([...itensSelecionados, item]);
    }
  };

  const pesoTotal = itensSelecionados.reduce(
    (total, item) => total + parseFloat(item.peso * item.quantidade),
    0
  );

  const valorTotalDeclarado = itensSelecionados.reduce(
    (total, item) => total + parseFloat(item.valorDeclarado * item.quantidade),
    0
  );

  const excluirLote = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este lote?")) {
      return; // Sai se o usuário cancelar
    }
    setIsLoading(true); // <-- Liga o "freeze"

    try {
      // 1. Tenta excluir o lote
      await window.electronAPI.excluirLote(id);
      await loadEstoque();
      await loadLotes();

    } catch (error) {
      // Se qualquer um dos 'await' acima falhar, ele cai aqui
      console.error("Erro ao excluir lote:", error);
      alert("Ocorreu um erro ao excluir o lote: " + error.message);
    } finally {
      // Este bloco SEMPRE será executado, não importa o que aconteça
      setIsLoading(false); // <-- Desliga o "freeze"
    }
  };
  const handleEditarNome = async (loteId) => {
    const loteAtual = lotes.find(l => l.id === loteId);
    const novoNome = window.prompt("Digite o novo nome para o lote:", loteAtual.nome || "");

    if (novoNome === null) return; // Usuário cancelou

    setIsLoading(true);
    try {
      await window.electronAPI.updateLoteNome(loteId, novoNome);
      await loadLotes(); // Recarrega os lotes para mostrar o nome novo
    } catch (error) {
      console.error("Erro ao atualizar nome:", error);
      alert("Falha ao atualizar o nome.");
    } finally {
      setIsLoading(false);
    }
  };
  const salvarLote = async () => {
    if (!dataLote || !valorDolar || itensSelecionados.length === 0) {
      alert("Preencha Nome, Data, Dólar e selecione ao menos 1 item.");
      return;
    }
    if (pesoCaixaUSCLOSER <= 0) {
      alert("O Peso da Caixa USCLOSER deve ser maior que zero.");
      return;
    }

    setIsLoading(true);

    // --- CORREÇÃO DE BUG: Use variáveis locais para os cálculos ---
    // (Removemos os estados 'valorFrete', 'importacao', 'icms')

    // 1. Calcular Frete (BRL)
    const freteTotalUSD = (pesoTotal * valorCaixaUSCLOSER) / pesoCaixaUSCLOSER;
    const freteTotalBRL = freteTotalUSD * valorDolar;

    // 2. Calcular Imposto de Importação (BRL)
    const baseImportacao = (valorTotalDeclarado + seguro + freteDeclarado) * valorDolar;
    const taxaImportacaoBRL = baseImportacao * (taxasFixas.importacao / 100);

    // 3. Calcular ICMS (BRL)
    const baseCalculoICMS = baseImportacao + taxaImportacaoBRL;
    const aliquotaDecimal = taxasFixas.icms / 100;
    const icmsBRL = (baseCalculoICMS / (1 - aliquotaDecimal)) * aliquotaDecimal;

    const lote = {
      nome: nomeLote, // <-- Novo
      data_criacao: dataLote,
      valor_dolar: valorDolar,
      valor_caixa_uscloser: valorCaixaUSCLOSER,
      peso_caixa_uscloser: pesoCaixaUSCLOSER,
      frete_declarado: freteDeclarado,
      seguro: seguro,
      // --- CORREÇÃO DE BUG: Salva os valores corretos ---
      frete_lote: freteTotalBRL,
      valor_importacao: taxaImportacaoBRL,
      valor_icms: icmsBRL,
    };

    try {
      await window.electronAPI.salvarLote(lote, itensSelecionados);

      // Limpar formulário
      setNomeLote("");
      setDataLote("");
      setValorDolar(0);
      setValorCaixaUSCLOSER(0);
      setPesoCaixaUSCLOSER(0);
      setFreteDeclarado(0);
      setSeguro(0);
      setItensSelecionados([]);

      // Recarregar dados
      await loadEstoque();
      await loadLotes();
    } catch (error) {
      console.error("Erro ao salvar lote:", error);
      alert("Falha ao salvar o lote.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseNomeModal = () => {
    setIsNomeModalOpen(false);
    setEditingLoteId(null);
    setNovoNomeLote("");
  }

  const toggleLoteDetails = (loteId) => {
    setOpenLoteId((prevId) => {
      // Se o lote clicado já está aberto, feche-o (null)
      if (prevId === loteId) {
        return null;
      }
      // Senão, abra o lote clicado
      return loteId;
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Header texto="Criar Lote" />
        <main className="p-6 space-y-6 overflow-y-auto">
          <section className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-bold mb-4">Dados do Lote</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nome do Lote (Opcional)
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={nomeLote}
                  onChange={(e) => setNomeLote(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Data de Criação
                </label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={dataLote}
                  onChange={(e) => setDataLote(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Valor do Dólar
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={valorDolar}
                  onChange={(e) => setValorDolar(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Valor da Caixa USCLOSER (USD)
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={valorCaixaUSCLOSER}
                  onChange={(e) =>
                    setValorCaixaUSCLOSER(parseFloat(e.target.value))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Peso da Caixa USCLOSER (lbs)
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={pesoCaixaUSCLOSER}
                  onChange={(e) =>
                    setPesoCaixaUSCLOSER(parseFloat(e.target.value))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Frete a Declarar (USD)
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={freteDeclarado}
                  onChange={(e) =>
                    setFreteDeclarado(parseFloat(e.target.value))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Seguro (USD)
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={seguro}
                  onChange={(e) => setSeguro(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Peso Total Itens:{" "}
              <span className="font-bold">{pesoTotal.toFixed(2)} lbs</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Valor Declarado Total Itens:{" "}
              <span className="font-bold">
                {valorTotalDeclarado.toFixed(2)} USD
              </span>
            </p>

            <h3 className="text-xl font-bold mb-4">
              Selecionar Itens do Estoque
            </h3>
            <table className="w-full table-auto text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="p-2">Selecionar</th>
                  <th className="p-2">Nome</th>
                  <th className="p-2">Peso</th>
                  <th className="p-2">Quantidade</th>
                  <th className="p-2">Data</th>
                </tr>
              </thead>
              <tbody>
                {itensEstoque.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={itensSelecionados.some(
                          (i) => i.id === item.id
                        )}
                        onChange={() => toggleSelecionado(item)}
                      />
                    </td>
                    <td className="p-2">{item.nome}</td>
                    <td className="p-2">{item.peso} lbs</td>
                    <td className="p-2">{item.quantidade}</td>
                    <td className="p-2">{formatarDataBR(item.dataCompra)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-right">
              <button
                onClick={salvarLote}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Criar Lote
              </button>
            </div>
          </section>

          <section className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-bold mb-4">Lotes Criados</h3>
            {lotes.map((lote) => {
              const isThisLoteOpen = lote.id === openLoteId;
              const valorTotalDeclaradoDoLote = lote.itens.reduce(
                (total, item) =>
                  total + parseFloat(item.valorDeclarado * item.quantidade),
                0
              );

              return (
                <div key={lote.id} className="mb-6 border-b pb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h4
                      className="font-semibold text-lg cursor-pointer"
                      onClick={() => toggleLoteDetails(lote.id)} // Adiciona o toggle
                    >
                      <span className="w-6 inline-block">
                        {isThisLoteOpen ? "[-]" : "[+]"}
                      </span>
                      {lote.nome || "Sem Nome"} - {formatarDataBR(lote.data)}
                    </h4>
                    <div>
                      {/* AJUSTE: Botões de Editar Nome e Excluir */}
                      <button
                        onClick={() => handleOpenNomeModal(lote.id)}
                        disabled={isLoading}
                        className="text-blue-600 hover:underline mr-4"
                      >
                        Editar Nome
                      </button>
                      <button
                        onClick={() => excluirLote(lote.id)}
                        disabled={isLoading}
                        className="text-red-600 hover:underline"
                      >
                        Excluir Lote
                      </button>
                    </div>
                  </div>

                  {/* ======================================================= */}
                  {/* AJUSTE: O BLOCO DOS CARDS COLORIDOS ESTÁ DE VOLTA AQUI */}
                  {/* ======================================================= */}
                  {isThisLoteOpen && (
                    <>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-100 p-4 rounded shadow text-center">
                          <p className="text-sm text-gray-700">Valor do Dólar</p>
                          <p className="text-xl font-bold text-blue-800">
                            R$ {lote.dolar.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded shadow text-center">
                          <p className="text-sm text-gray-700">
                            Alíquota de Importação
                          </p>
                          <p className="text-xl font-bold text-yellow-800">
                            {taxasFixas.importacao}%
                          </p>
                        </div>
                        <div className="bg-purple-100 p-4 rounded shadow text-center">
                          <p className="text-sm text-gray-700">Alíquota de ICMS</p>
                          <p className="text-xl font-bold text-purple-800">
                            {taxasFixas.icms}%
                          </p>
                        </div>
                        <div className="bg-green-100 p-4 rounded shadow text-center">
                          <p className="text-sm text-gray-700">Frete (R$)</p>
                          <p className="text-xl font-bold text-green-800">
                            R$ {lote.freteLote.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-red-100 p-4 rounded shadow text-center">
                          <p className="text-sm text-gray-700">Importação (R$)</p>
                          <p className="text-xl font-bold text-red-800">
                            R$ {lote.valorImportacao.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-indigo-100 p-4 rounded shadow text-center">
                          <p className="text-sm text-gray-700">ICMS (R$)</p>
                          <p className="text-xl font-bold text-indigo-800">
                            R$ {lote.valorICMS.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <table className="w-full table-auto text-left border-collapse mt-4">
                        <thead>
                          <tr className="border-b bg-gray-100">
                            <th className="p-2">Nome</th>
                            <th className="p-2">Qtd.</th>
                            <th className="p-2">Valor Compra (USD)</th>
                            <th className="p-2">Frete Unit. (R$)</th>
                            <th className="p-2">Taxas Unit. (R$)</th>
                            <th className="p-2">Custo Unitário (R$)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lote.itens.map((item) => {

                            // --- NOVOS CÁLCULOS UNITÁRIOS ---

                            // 1. Custo de Compra (Unitário)
                            const custoCompraUnitarioBRL = item.valorCompra * lote.dolar;

                            // 2. Custo do Frete (Unitário)
                            const freteUnitarioUSD = (item.peso * lote.valorCaixa) / lote.pesoCaixa;
                            const freteUnitarioBRL = freteUnitarioUSD * lote.dolar;

                            // 3. Custo das Taxas (Unitário)
                            // % que o valor (unit * qtd) deste item representa do total
                            const percentualDoValor =
                              (item.valorDeclarado * item.quantidade) / valorTotalDeclaradoDoLote;

                            // Taxas totais (Importação + ICMS) para esta *linha* de item
                            const taxasLinhaBRL =
                              (lote.valorImportacao + lote.valorICMS) * percentualDoValor;

                            // Taxas divididas pela quantidade para achar o valor unitário
                            const taxasUnitarioBRL = taxasLinhaBRL / item.quantidade;

                            // 4. Custo Final (Unitário)
                            const custoFinalUnitarioBRL =
                              custoCompraUnitarioBRL +
                              freteUnitarioBRL +
                              taxasUnitarioBRL;

                            return (
                              <tr key={item.id} className="border-b">
                                <td className="p-2">{item.nome}</td>
                                <td className="p-2">{item.quantidade}</td>
                                <td className="p-2">${item.valorCompra.toFixed(2)}</td>
                                <td className="p-2">
                                  R$ {freteUnitarioBRL.toFixed(2)}
                                </td>
                                <td className="p-2">
                                  R$ {taxasUnitarioBRL.toFixed(2)}
                                </td>
                                <td className="p-2 font-bold">
                                  R$ {custoFinalUnitarioBRL.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              );
            })}
          </section>
        </main>
      </div>
      <EditNomeLoteModal
        isOpen={isNomeModalOpen}
        onClose={handleCloseNomeModal}
        onSave={handleSaveNovoNome}
        value={novoNomeLote}
        onChange={(e) => setNovoNomeLote(e.target.value)}
        isLoading={isLoading}
      />
    </div>
  );
}
