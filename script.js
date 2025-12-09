const q = sel => document.querySelector(sel);

const basicForm = q('#basicForm');
const projectForm = q('#projectForm');
const resultScreen = q('#resultScreen');

const toProjectBtn = q('#toProject');
const toResultBtn = q('#toResult');
const baixarPdfBtn = q('#baixarPDF');

const step1 = q('#step1');
const step2 = q('#step2');
const step3 = q('#step3');
const line1 = q('#line1');
const line2 = q('#line2');

const resFinanciadoEl = q('#resFinanciado');
const resTotalEl = q('#resTotal');
const resPrimeiraParcelaEl = q('#resPrimeiraParcela');
const resJurosEl = q('#resJuros');

const inputValorFinanciado = q('#valorFinanciado');
const inputPrazo = q('#prazo');
const inputCarencia = q('#carencia');
const inputSistema = q('#sistemaAmortizacao');
const descontoCheckbox = q('#descontoPontualidade');

function showPanel(panel) {
  [basicForm, projectForm, resultScreen].forEach(p => {
    p.classList.add('hidden');
  });
  panel.classList.remove('hidden');
}

function anualToMensal(anual) {
  return Math.pow(1 + anual, 1/12) - 1;
}

function parcelaPrice(financiado, i, n) {
  if (i === 0) return financiado / n;
  return financiado * (i / (1 - Math.pow(1 + i, -n)));
}

function formatBRL(value) {
  if (isNaN(value) || !isFinite(value)) return '0,00';
  return Number(value).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

toProjectBtn.addEventListener('click', () => {
  const nome = q('#nome').value.trim();
  const empresa = q('#empresa').value.trim();
  const cnpj = q('#cnpj').value.trim();
  const email = q('#email').value.trim();

  if (!nome || !empresa || !cnpj || !email) {
    alert('Preencha nome, empresa, CNPJ e e-mail antes de prosseguir.');
    return;
  }

  showPanel(projectForm);

  step2.classList.add('active');
  line1.classList.add('filled');
});

toResultBtn.addEventListener('click', () => {
  const financiado = parseFloat(inputValorFinanciado.value) || 0;
  const prazo = parseInt(inputPrazo.value) || 0;
  const carencia = parseInt(inputCarencia.value) || 0;
  const sistema = inputSistema.value || 'PRICE';
  const aplicarDesconto = descontoCheckbox.checked;

  if (financiado <= 0 || prazo <= 0) {
    alert('Informe o valor financiado e o prazo corretamente.');
    return;
  }

  const taxaAnual = 0.0796;
  const taxaMensal = anualToMensal(taxaAnual);

  let parcelaMensal = 0;
  let totalPago = 0;
  let totalJuros = 0;
  let primeiraParcelaAposCarencia = 0;

  if (sistema === 'PRICE') {
    parcelaMensal = parcelaPrice(financiado, taxaMensal, prazo);
    primeiraParcelaAposCarencia = parcelaMensal;
    totalPago = parcelaMensal * prazo;
    totalJuros = totalPago - financiado;

  } else if (sistema === 'SAC') {
    const amortConst = financiado / prazo;
    const jurosPrimeiro = financiado * taxaMensal;

    primeiraParcelaAposCarencia = amortConst + jurosPrimeiro;
    totalJuros = taxaMensal * financiado * (prazo + 1) / 2;
    totalPago = financiado + totalJuros;
  }

  if (aplicarDesconto) {
    totalPago = totalPago * 0.85;
    totalJuros = totalPago - financiado;
  }

  resFinanciadoEl.textContent = formatBRL(financiado);
  resTotalEl.textContent = formatBRL(totalPago);
  resPrimeiraParcelaEl.textContent = formatBRL(primeiraParcelaAposCarencia);
  resJurosEl.textContent = formatBRL(totalJuros);

  showPanel(resultScreen);

  step3.classList.add('active');
  line2.classList.add('filled');
});

baixarPdfBtn.addEventListener('click', () => {
  const nome = q('#nome').value || '';
  const empresa = q('#empresa').value || '';
  const cnpj = q('#cnpj').value || '';
  const email = q('#email').value || '';
  const telefone = q('#telefone').value || '';

  const setor = q('#setor').value || '';
  const modalidade = q('#modalidade').value || '';
  const valorProjeto = q('#valorProjeto').value || '';
  const valorFinanciado = q('#valorFinanciado').value || '';
  const prazo = q('#prazo').value || '';
  const carencia = q('#carencia').value || '';
  const sistema = q('#sistemaAmortizacao').value || '';
  const aplicarDesconto = descontoCheckbox.checked ? 'Sim (15%)' : 'Não';

  const resFin = resFinanciadoEl.textContent || '0,00';
  const resTot = resTotalEl.textContent || '0,00';
  const resPrime = resPrimeiraParcelaEl.textContent || '0,00';
  const resJ = resJurosEl.textContent || '0,00';

  const pdfContent = document.createElement('div');
  pdfContent.style.padding = '20px';
  pdfContent.innerHTML = `
    <h2>Simulação FNO</h2>

    <h3>Dados do solicitante</h3>
    <p><strong>Nome:</strong> ${nome}</p>
    <p><strong>Empresa:</strong> ${empresa}</p>
    <p><strong>CNPJ:</strong> ${cnpj}</p>
    <p><strong>E-mail:</strong> ${email} • <strong>Telefone:</strong> ${telefone}</p>

    <h3>Dados do projeto</h3>
    <p><strong>Setor:</strong> ${setor}</p>
    <p><strong>Modalidade:</strong> ${modalidade}</p>
    <p><strong>Valor do projeto:</strong> R$ ${Number(valorProjeto || 0).toLocaleString('pt-BR')}</p>
    <p><strong>Valor financiado:</strong> R$ ${Number(valorFinanciado || 0).toLocaleString('pt-BR')}</p>
    <p><strong>Prazo:</strong> ${prazo} meses • <strong>Carência:</strong> ${carencia} meses</p>
    <p><strong>Sistema:</strong> ${sistema}</p>
    <p><strong>Desconto de pontualidade:</strong> ${aplicarDesconto}</p>

    <h3>Resultados</h3>
    <p><strong>Total financiado:</strong> R$ ${resFin}</p>
    <p><strong>Total a pagar:</strong> R$ ${resTot}</p>
    <p><strong>Primeira parcela:</strong> R$ ${resPrime}</p>
    <p><strong>Total de juros:</strong> R$ ${resJ}</p>
  `;

  const opt = {
    margin: 10,
    filename: `simulacao_fno_${(new Date()).toISOString().slice(0,10)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(pdfContent).save();
});
