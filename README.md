Este e um projeto simulador de NFO

permitindo que o usuário prencha os Dados e visualize calculos e baixe o relatorio em pdf da simulação.
as tecnologias usadas no projeto foram:
* HTML
aonde foi feita a estrutura do projeto, estrutura dividida em sidebar "barra lateral", e content "conteudo principal"
* Dados básicos (nome, empresa, CNPJ, contato, estado/município).
* SeuProjeto (setor, modalidade, valores, prazos, sistema de amortização).
* Resultado (valor financiado, total pago, primeira parcela, juros)
Botões de navegação entre etapas e botão final para gerar PDF.
* CSS
  para estilização, sidebar  mostra o progresso no qual quando o usuário avança as paginas ele muda de cor conforme o avanço
  inputs e selects estilizados
* JAVASCRIPT
  aonde foram feitas os scripts, da aplicação
  Navegação entre etapas, Função showPanel() alterna visibilidade dos painéis, para abrir uma caixa de dialogo
Sidebar atualiza com .active e .filled para indicar progresso.
Validações e calculos financeiros
Geração do PDF html2pdf.js  via CDN, monta o relatorio com os dados e baixa o PDF

* BOOTSTRAP
 para icones e componetes visuais 

  

