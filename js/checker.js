"use strict";

(() => {

  const meta_description = 'Kira-Kira English(キラキライングリッシュ)は、お子様向けのオンライン英会話教室です。0歳から15歳までのお子様向けに楽しく学べて“使える英語力”が身につき幅広いレッスンが受講でき、家族割やきょうだい割も大好評！ご希望に合わせて英語検定受験コース、高校受験向けコースも開講しています。';
  const head_title = 'Kira-Kira English｜キラキライングリッシュ キッズオンライン英会話教室';

  const createElementFromHTML = (html) => {
    const tempEl = document.createElement('div');
    tempEl.innerHTML = html;
    return tempEl.firstElementChild;
  };

  const comment = (s, t) => {
    const div = document.createElement('div');
    div.classList.add('section-header');
    div.append(s);
    result.append(div);

    if (t) {
      const ss = document.createElement('span');
      ss.classList.add('desc');
      result.append('\n');
      ss.append(t);
      result.append(ss);
    }

    result.append('\n\n');
  };

  const write = (s, f) => {
    if (f) {
      const tempel = createElementFromHTML('<span>' + s + '<span>');
      result.append(tempel);
      result.append('\n\n');
    }
    else {
      result.append(s + '\n\n');
    }
  };

  const numbering = (source) => {
    let t = '';
    let c = 0;
    source.forEach((row) => {
      c++;
      t = t + (('00000' + c).slice(-6)) + ':' + row + '\n';
    });
    return t;
  };

  const html_error_check = async () => {
    const source = document.getElementById('html').value;
    const headers = {
      'Content-Type': 'text/html'
    };

    let res;
    try {
      res = await fetch('https://validator.w3.org/nu/?out=json', {
        method: 'POST',
        headers,
        body: source,
      });
    }
    catch (ex) {
      console.error(ex);
      return 'エラーチェックが失敗しました';
    }

    const data = await res.json();
    if (data?.messages && data.messages.length == 0) {
      return null;
    }
    else if (data?.messages) {
      let isError = false;
      data.messages.forEach((mes) => {
        if (mes.type == 'error') {
          isError = true;
        }
      });
      if (isError) {
        return 'エラーがあります';
      }
    }
    else {
      return 'なんか正しくないです';
    }
  };


  const css_error_check = async () => {
    const source = document.getElementById('css').value;
    const body = new FormData;
    body.append('profile', 'css3svg');
    body.append('lang', 'ja');
    body.append('output', 'json');
    body.append('text', source);

    let res;
    try {
      res = await fetch('https://jigsaw.w3.org/css-validator/validator', {
        method: 'POST',
        body
      });
    }
    catch (ex) {
      console.error(ex);
      return 'エラーチェックが失敗しました';
    }

    const data = await res.json();
    if (data?.cssvalidation?.result?.hasOwnProperty('errorcount')) {
      if (data.cssvalidation.result.errorcount === 0) {
        return null;
      }
      return 'エラーがあります';
    }
    else {
      return 'なんか正しくないです';
    }
  };

  const result = document.getElementById('result');

  const buttonOnClick = async () => {
    const row_html = document.getElementById('html').value;
    const html = numbering(row_html.split(/\n/));
    const css = numbering(document.getElementById('css').value.split(/\n/));
    const js = numbering(document.getElementById('js').value.split(/\n/));

    result.innerHTML = '';

    const doc = document.implementation.createHTMLDocument("").documentElement;
    doc.innerHTML = row_html;

    let results;
    let errorMessage = '';

    comment('HTMLエラーチェック');
    errorMessage = await html_error_check();
    if (errorMessage) {
      write(`<span class="status-error">🟢 ${errorMessage}</span>`, true);
      // write(`<button type="button" class="validator" onclick="document.forms['html-check-form'].submit();return false;">Validatorを開く</button>`, true);
    }
    else {
      write(`<span class="status-normal">🔵 エラーはありません</span>`, true);
    }

    comment('CSSエラーチェック');
    errorMessage = await css_error_check();
    if (errorMessage) {
      write(`<span class="status-error">🟢 ${errorMessage}</span>`, true);
      // write(`<button type="button" class="validator" onclick="document.forms['css-check-form'].submit();return false;">Validatorを開く</button>`, true);
    }
    else {
      write(`<span class="status-normal">🔵 エラーはありません</span>`, true);
    }

    comment('Googleフォントチェック', 'Noto Sans JPの400,700または100..900、Poppinsの通常700,800,斜体700,800が必要です。');
    const googleFonts = doc.querySelectorAll('link[href^="https://fonts.googleapis.com/"]');
    let fontFamilyError = false;
    if (googleFonts.length === 0) {
      write(`<span class="status-error">🟢 linkタグがありません</span>`, true);
      fontFamilyError = true;
    }
    if (googleFonts.length > 1) {
      write(`<span class="status-error">🟢 linkタグが複数あります</span>`, true);
      fontFamilyError = true;
    }
    let googleFontNotoSansOK = false;
    let googleFontPoppinsOK = false;
    googleFonts.forEach((ele) => {
      const url = new URL(ele.href);
      const families = url.searchParams.getAll('family');
      for (let f of families) {
        if (f.match('Noto Sans JP')) {
          googleFontNotoSansOK = (f == 'Noto Sans JP:wght@400;700' || f == 'Noto Sans JP:wght@100..900');
        }
        if (f.match('Poppins')) {
          googleFontPoppinsOK = (f == 'Poppins:ital,wght@0,700;0,800;1,700;1,800');
        }
      }
    });
    if (!googleFontNotoSansOK) {
      write(`<span class="status-error">🟢 Noto Sans JPの読み込みが正しくありません</span>`, true);
      fontFamilyError = true;
    }
    if (!googleFontPoppinsOK) {
      write(`<span class="status-error">🟢 Poppinsの読み込みが正しくありません</span>`, true);
      fontFamilyError = true;
    }
    if (fontFamilyError) {
      let linkTag = '';
      googleFonts.forEach((ele) => {
        linkTag += ele.outerHTML + '\n';
      });
      write(linkTag);
    }
    else {
      write('<span class="status-normal">🔵 Googleフォント...OK</span>', true);
    }

    comment('HTMLのコメント');
    results = [...html.matchAll(/.*<!--[\s\S]+?-->/g)];
    results.forEach((ele) => {
      write(ele[0]);
    });

    comment('CSSのコメント');
    results = [...css.matchAll(/.*\/\*[\s\S]+?\*\//g)];
    results.forEach((ele) => {
      write(ele[0]);
    });

    comment('JavaScriptのコメント');
    results = [...js.matchAll(/.*\/\*[\s\S]+?\*\//g), ...js.matchAll(/.*\/\/.+/g)];
    results.forEach((ele) => {
      write(ele[0]);
    });

    comment('meta description', '完全一致が求められています。');
    const content = doc.querySelector('meta[name="description"]')?.content?.trim();
    if (meta_description === content) {
      write('<span class="status-normal">🔵 description...OK</span>', true);
    }
    else {
      write('<span class="status-error">🟢 description...NG</span>', true);
      write(content);
    }

    comment('title', '完全一致が求められています。');
    const title = doc.querySelector('title')?.innerText?.trim();
    if (head_title === title) {
      write('<span class="status-normal">🔵 title...OK</span>', true);
    }
    else {
      write('<span class="status-error">🟢 title...NG</span>', true);
      write(title);
    }

    comment('必須タグ');
    if (doc.querySelectorAll('header').length) {
      write('<span class="status-normal">🔵 header...OK</span>', true);
    }
    else {
      write('<span class="status-error">🟢 header...NG</span>', true);
    }
    if (doc.querySelectorAll('nav').length) {
      write('<span class="status-normal">🔵 nav...OK</span>', true);
    }
    else {
      write('<span class="status-error">🟢 nav...NG</span>', true);
    }
    if (doc.querySelectorAll('main').length) {
      write('<span class="status-normal">🔵 main...OK</span>', true);
    }
    else {
      write('<span class="status-error">🟢 main...NG</span>', true);
    }
    if (doc.querySelectorAll('section').length) {
      write('<span class="status-normal">🔵 section...OK</span>', true);
    }
    else {
      write('<span class="status-error">🟢 section...NG</span>', true);
    }
    if (doc.querySelectorAll('footer').length) {
      write('<span class="status-normal">🔵 footer...OK</span>', true);
    }
    else {
      write('<span class="status-error">🟢 footer...NG</span>', true);
    }

    comment('見出しタグ', 'h1から始まり、順序を飛ばさずh2→h3の順で使用します。');
    results = doc.querySelectorAll('h1,h2,h3,h4,h5,h6');
    let h1count = doc.querySelectorAll('h1').length;
    if (h1count === 0) {
      write('<span class="status-info">h1がありません。</span>', true);
    }
    else {
      if (h1count > 1) {
        write('<span class="status-info">h1が1つではありません。</span>', true);
      }
      if (results[0].tagName != 'H1') {
        write('<span class="status-info">最初がh1ではありません。</span>', true);
      }
    }
    let savedLevel = 0;
    results.forEach((ele) => {
      const level = ele.tagName.slice(-1) - 0;
      const re = ele.outerHTML
        .replaceAll('<', '&lt;').replaceAll('>', '&gt;').replace(/\n +/g, '\n')
        .replace(/&lt;h[1-6].*?&gt;/i, '<span class="status-error">$&</span>')
        .replace(/&lt;\/h[1-6]&gt;/i, '<span class="status-error">$&</span>');
      const added = (savedLevel < level && ((level - savedLevel) !== 1)) ? '　<span class="status-info">（飛んでいます）</span>' : '';
      write(re + added, true);

      savedLevel = level;
    });
    comment('改行チェック', '文中の強制改行はNGです。');
    results = doc.querySelectorAll('br');
    let parentElements = [];
    results.forEach((ele) => {
      const pa = ele.parentElement;
      if (parentElements.indexOf(pa) < 0) {
        parentElements.push(pa);
        const re = pa.outerHTML
          .replaceAll('<', '&lt;').replaceAll('>', '&gt;').replace(/\n +/g, '\n')
          .replace(/&lt;br.*?&gt;/ig, '<span class="status-error">$&</span>');
        write(re, true);
      }
    });

    comment('alt属性チェック', 'スクリーンリーダーで読ませた時に違和感が出ないようにします。文字が画像化されている時は、変更せずにaltに適用します。');
    results = doc.querySelectorAll('img');
    results.forEach((ele) => {
      const re = ele.outerHTML
        .replaceAll('<', '&lt;').replaceAll('>', '&gt;')

        .replace(/alt="[^"]*?"/i, '<span class="status-error">$&</span>');
      write(re, true);
    });

    comment('■id属性チェック');
    results = doc.querySelectorAll('[id]');
    results.forEach((ele) => {
      const re = ele.outerHTML.split('\n')[0]
        .replaceAll('<', '&lt;').replaceAll('>', '&gt;')
        .replace(/ id="[^"]*?"/i, '<span class="red">$&</span>');
      write(re, true);
    });

    comment('■リンクチェック');
    results = doc.querySelectorAll('a');
    results.forEach((ele) => {
      const re = ele.outerHTML
        .replaceAll('<', '&lt;').replaceAll('>', '&gt;')
        .replace(/&lt;a\s[\s\S]*?&gt;/i, '<span class="blue">$&</span>')
        .replace(/ href="[^"]*"/i, '<span class="red">$&</span>');
      write(re, true);
    });

    comment('■hoverチェック');
    results = [...css.matchAll(/.*:hover.*/g)];
    results.forEach((ele) => {
      write(ele[0]);
    });

    comment('■positionプロパティチェック');
    results = [...css.matchAll(/.*\sposition\s*:.*/g)];
    results.forEach((ele) => {
      write(ele[0]);
    });

    comment('■ネガティブマージンチェック', 'ネガティブマージンは極力使わないようにします。');
    results = [...css.matchAll(/.*\s*margin[^:]*\s*:\s*-[.\d]+.*/g)];
    results.forEach((ele) => {
      write(ele[0]);
    });

    comment('■transformプロパティチェック', '過度のtransformプロパティの利用がないかチェックしてください。');
    results = [...css.matchAll(/.*\stransform\s*:.*/g)];
    results.forEach((ele) => {
      write(ele[0]);
    });

    comment('■slickチェック', 'autoplayにtrueが設定されているか？');
    if (document.getElementById('slick').value == 1) {
      write('<span class="blue">OK</span>', true);
    }
    else {
      write('<span class="red">NG</span>', true);
    }

    comment('■チェック終了');
    result.style.display = 'block';
  };

  document.querySelectorAll('.perform').forEach((button) => {
    button.addEventListener('click', buttonOnClick);
  });

  document.getElementById('CHECK_LIST_DOWNLOAD').addEventListener('click', (e) => {
    e.preventDefault();

    html2canvas(document.querySelector('#messages .tables')).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "CHECK_LIST_" + (new Date).toLocaleString().replaceAll(/[\/: ]/g, '_') + ".png";
      link.click();
    });

  });
  document.getElementById('CHECK_DETAILS_DOWNLOAD').addEventListener('click', (e) => {
    e.preventDefault();

    html2canvas(document.querySelector('#messages .details')).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "CHECK_DETAILS_" + (new Date).toLocaleString().replaceAll(/[\/: ]/g, '_') + ".png";
      link.click();
    });
  });

  // アンドゥ機能とインタラクティブ要素管理
  const UndoManager = {
    history: [],
    maxHistorySize: 50,
    isUndoing: false,

    pushState(element, action, parent = null, nextSibling = null, correspondingElement = null) {
      if (this.isUndoing) return; // アンドゥ中は履歴を追加しない

      this.history.push({
        element: element.cloneNode(true),
        action,
        parent: parent || element.parentElement,
        nextSibling: nextSibling || element.nextElementSibling,
        correspondingElement: correspondingElement ? correspondingElement.cloneNode(true) : null,
        correspondingParent: correspondingElement ? correspondingElement.parentElement : null,
        correspondingNextSibling: correspondingElement ? correspondingElement.nextElementSibling : null,
        timestamp: Date.now()
      });

      if (this.history.length > this.maxHistorySize) {
        this.history.shift();
      }
    },

    undo() {
      if (this.history.length === 0) {
        showToast('元に戻せる操作がありません', 'info');
        return false;
      }

      if (this.isUndoing) {
        showToast('アンドゥ処理中です。少しお待ちください。', 'warning');
        return false;
      }

      this.isUndoing = true;

      try {
        const lastState = this.history.pop();

        if (lastState.action === 'delete') {
          // メイン要素を復元
          try {
            if (lastState.nextSibling &&
              lastState.parent.contains(lastState.nextSibling) &&
              lastState.nextSibling.parentNode === lastState.parent) {
              lastState.parent.insertBefore(lastState.element, lastState.nextSibling);
            } else {
              lastState.parent.appendChild(lastState.element);
            }
          } catch (insertError) {
            console.warn('Main element insertion failed, appending instead:', insertError);
            lastState.parent.appendChild(lastState.element);
          }

          // 対応する要素も復元
          if (lastState.correspondingElement && lastState.correspondingParent) {
            try {
              if (lastState.correspondingNextSibling &&
                lastState.correspondingParent.contains(lastState.correspondingNextSibling) &&
                lastState.correspondingNextSibling.parentNode === lastState.correspondingParent) {
                lastState.correspondingParent.insertBefore(lastState.correspondingElement, lastState.correspondingNextSibling);
              } else {
                lastState.correspondingParent.appendChild(lastState.correspondingElement);
              }
            } catch (insertError) {
              console.warn('Corresponding element insertion failed, appending instead:', insertError);
              lastState.correspondingParent.appendChild(lastState.correspondingElement);
            }

            // 対応する要素にもイベントリスナーを再追加
            addEventListenersToElement(lastState.correspondingElement);
          }

          showToast('削除を元に戻しました', 'info');

          // 復元した要素にイベントリスナーを再追加
          addEventListenersToElement(lastState.element);

          return true;
        }

        return false;
      } finally {
        // アンドゥ処理完了後、少し待ってからフラグを解除
        setTimeout(() => {
          this.isUndoing = false;
        }, 100);
      }
    }
  };

  // トーストメッセージ表示
  function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // アニメーション開始
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // 3秒後に削除
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // 対応する要素を見つける関数
  function findCorrespondingElement(element, sourceContainer, targetContainer) {
    const sourceElements = Array.from(sourceContainer.children);
    const targetElements = Array.from(targetContainer.children);
    const index = sourceElements.indexOf(element);

    if (index >= 0 && index < targetElements.length) {
      return targetElements[index];
    }
    return null;
  }

  // 文字要素の識別用のIDを取得する関数
  function getElementIdentifier(element) {
    if (element.classList.contains('table')) {
      // テーブルの場合、最初のcolのテキストを識別子とする
      const firstCol = element.querySelector('.col:first-child');
      return firstCol ? firstCol.textContent.trim() : null;
    } else if (element.classList.contains('datum')) {
      // datumの場合、特定の子要素のテキストを識別子とする
      const identifier = element.querySelector('strong');
      return identifier ? identifier.textContent.trim() : null;
    }
    return null;
  }

  // 対応する要素を識別子で検索する関数
  function findCorrespondingElementByIdentifier(sourceElement, targetContainer) {
    const sourceId = getElementIdentifier(sourceElement);
    if (!sourceId) return null;

    const targetElements = targetContainer.querySelectorAll('.table, .datum');
    for (let target of targetElements) {
      const targetId = getElementIdentifier(target);
      if (targetId && targetId === sourceId) {
        return target;
      }
    }
    return null;
  }

  // 削除アニメーション（同期機能付き）
  function deleteElementWithAnimation(element, actionType = '要素', skipSync = false) {
    if (element.classList.contains('deleting')) {
      return; // 既に削除中の場合は何もしない
    }

    let correspondingElement = null;

    // 同期削除の処理
    if (!skipSync) {
      const tablesContainer = document.querySelector('#messages .tables');
      const detailsContainer = document.querySelector('#messages .details');

      if (tablesContainer && detailsContainer) {
        if (tablesContainer.contains(element)) {
          // テーブルから削除する場合、詳細から対応する要素を削除
          correspondingElement = findCorrespondingElementByIdentifier(element, detailsContainer);
        } else if (detailsContainer.contains(element)) {
          // 詳細から削除する場合、テーブルから対応する要素を削除
          correspondingElement = findCorrespondingElementByIdentifier(element, tablesContainer);
        }
      }
    }

    // アンドゥ用の状態を保存（対応要素の情報も含める）
    UndoManager.pushState(element, 'delete', null, null, correspondingElement);

    element.classList.add('deleting');

    // 対応する要素も同時に削除アニメーションを開始
    if (correspondingElement && !skipSync) {
      correspondingElement.classList.add('deleting');
    }

    setTimeout(() => {
      if (element.parentElement) {
        element.remove();
      }

      if (correspondingElement && !skipSync && correspondingElement.parentElement) {
        correspondingElement.remove();
      }

      showToast(`${actionType}を削除しました` + (correspondingElement && !skipSync ? '（対応要素も削除）' : ''));
    }, 500);
  }

  // 連続削除防止（強化版）
  let lastDeleteTime = 0;
  let deleteCount = 0;
  let deleteResetTimer = null;
  const DELETE_COOLDOWN = 500; // 500ms
  const MAX_RAPID_DELETES = 3; // 3回まで連続削除を許可
  const RESET_INTERVAL = 2000; // 2秒でカウントリセット

  function canDelete() {
    const now = Date.now();

    // アンドゥ中は削除不可
    if (UndoManager.isUndoing) {
      showToast('アンドゥ処理中は削除できません。', 'warning');
      return false;
    }

    // 短時間での連続削除チェック
    if (now - lastDeleteTime < DELETE_COOLDOWN) {
      deleteCount++;
      if (deleteCount > MAX_RAPID_DELETES) {
        showToast('削除操作が早すぎます。少し待ってから再度お試しください。', 'error');
        return false;
      }
    } else {
      deleteCount = 1;
    }

    lastDeleteTime = now;

    // リセットタイマーをクリアして新しく設定
    if (deleteResetTimer) {
      clearTimeout(deleteResetTimer);
    }

    deleteResetTimer = setTimeout(() => {
      deleteCount = 0;
    }, RESET_INTERVAL);

    return true;
  }

  // 要素にイベントリスナーを追加
  function addEventListenersToElement(element) {
    // .table要素の場合
    if (element.classList.contains('table')) {
      // ダブルクリックイベント
      element.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        if (canDelete()) {
          deleteElementWithAnimation(element, 'テーブル行');
        }
      });

      // .col要素のクリックイベント
      const cols = element.querySelectorAll('.col');
      cols.forEach(col => {
        col.addEventListener('click', (e) => {
          e.stopPropagation();
          if (canDelete()) {
            deleteElementWithAnimation(col, 'カラム');
          }
        });
      });
    }

    // .datum要素の場合
    if (element.classList.contains('datum')) {
      // ダブルクリックイベント
      element.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        if (canDelete()) {
          deleteElementWithAnimation(element, '詳細ブロック');
        }
      });

      // 子要素のクリックイベント
      const children = element.children;
      Array.from(children).forEach(child => {
        child.addEventListener('click', (e) => {
          e.stopPropagation();
          if (canDelete()) {
            deleteElementWithAnimation(child, '詳細要素');
          }
        });
      });
    }
  }

  // 既存の要素にイベントリスナーを追加
  function initializeInteractiveElements() {
    // .table要素
    document.querySelectorAll('#messages .table').forEach(table => {
      addEventListenersToElement(table);
    });

    // .datum要素
    document.querySelectorAll('#messages .datum').forEach(datum => {
      addEventListenersToElement(datum);
    });
  }

  // MutationObserver で動的に追加される要素を監視
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList.contains('table') || node.classList.contains('datum')) {
            addEventListenersToElement(node);
          }

          // 子要素も確認
          const tables = node.querySelectorAll && node.querySelectorAll('.table');
          const data = node.querySelectorAll && node.querySelectorAll('.datum');

          if (tables) {
            tables.forEach(table => addEventListenersToElement(table));
          }
          if (data) {
            data.forEach(datum => addEventListenersToElement(datum));
          }
        }
      });
    });
  });

  // 監視開始
  observer.observe(document.getElementById('messages'), {
    childList: true,
    subtree: true
  });

  // キーボードショートカット（Command/Ctrl + Z）
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      UndoManager.undo();
    }
  });

  // 初期化
  document.addEventListener('DOMContentLoaded', () => {
    initializeInteractiveElements();
  });

  // 既存の要素も初期化（DOMContentLoadedが既に発火している場合）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInteractiveElements);
  } else {
    initializeInteractiveElements();
  }
})();