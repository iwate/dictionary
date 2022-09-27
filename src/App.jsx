import { createEffect, Match, Show, Switch } from 'solid-js';
import {createStore, produce} from 'solid-js/store';
import ngsl from './ngsl.json';
function App() {
  const [state, setState] = createStore({
    input: '',
    method: null,
    src: '',
    v1: '',
    v2: '',
    v3: '',
    v4: '',
    v5: '',
    vc: '',
    adj: '',
    adv: '',
    pre: '',
    noun: '',
    pronoun: '',
    conj: '',
    subConj: '',
    relpronoun: '',
    reladj: '',
    reladv: '',
    article: '',
    memo: '',
    data: [],
    initialized: false,
    lastModified: null
  });
  const setAside = (method, src) => {
    setState(() => ({
      method,
      src,
    }))
  }
  const search = () => {
    const item = state.data.words.find(d => d.input === state.input);
    if (item) {
      setState(() => item);
    }
  }
  const searchWeblio = () => {
    setAside('weblio', `https://ejje.weblio.jp/content/${state.input}`);
  }
  const searchYouglish = () => {
    setAside('youglish', `/dictionary/youglish/?word=${state.input}`);
  }
  const searchSkell = () => {
    setAside('skell', `https://skell.sketchengine.eu/#result?lang=en&query=${state.input}&f=concordance`);
  }
  const listNGSL = () => {
    setAside('ngsl', null);
  }
  const fileOptions = {
    types: [
      {
        description: "JSON Files",
        accept: {
          "application/json": [".json"],
          "text/plain": [".json"],
        },
      },
    ],
  };
  const load = async () => {
    const [handle] = await window.showOpenFilePicker(fileOptions);
    const file = await handle.getFile();
    const json = await file.text();
    let data = {
      words: [],
      ngslIndex: 0,
    };
    try { data = Object.assign(data, JSON.parse(json)); }catch{}
    setState(() => ({
      initialized: true,
      input: ngsl[data.ngslIndex],
      data
    }));
    search();
  }
  let fileHandle;
  const save = async () => {
    setState(produce(state => {
      const item = state.data.words.find(d => d.input === state.input);
      if (item) {
        item.v1 = state.v1;
        item.v2 = state.v2;
        item.v3 = state.v3;
        item.v4 = state.v4;
        item.v5 = state.v5;
        item.vc = state.vc;
        item.adj = state.adj;
        item.adv = state.adv;
        item.pre = state.pre;
        item.noun = state.noun;
        item.pronoun = state.pronoun;
        item.conj = state.conj;
        item.subConj = state.subConj;
        item.relpronoun = state.relpronoun;
        item.reladj = state.reladj;
        item.reladv = state.reladv;
        item.article = state.article;
        item.memo = state.memo;
      } else {
        state.data.words.push({
          input: state.input,
          v1: state.v1,
          v2: state.v2,
          v3: state.v3,
          v4: state.v4,
          v5: state.v5,
          vc: state.vc,
          adj: state.adj,
          adv: state.adv,
          pre: state.pre,
          noun: state.noun,
          pronoun: state.pronoun,
          conj: state.conj,
          subConj: state.subConj,
          relpronoun: state.relpronoun,
          reladj: state.reladj,
          reladv: state.reladv,
          article: state.article,
          memo: state.memo,
        })
      }
    }))
    if (!fileHandle) {
      fileHandle = await window.showSaveFilePicker(fileOptions);
    }
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(state.data, null, '\t'));
    await writable.close();
    setState(() => ({
      lastModified: new Date()
    }))
  }
  const nextNgsl = () => {
    if (state.data.ngslIndex < ngsl.length) {
      setState(produce(state => {
        state.data.ngslIndex = state.data.ngslIndex + 1;
      }));
      input(ngsl[state.data.ngslIndex]);
    }
  }
  const prevNgsl = () => {
    if (state.data.ngslIndex > 0) {
      setState(produce(state => {
        state.data.ngslIndex = state.data.ngslIndex - 1;
      }));
      input(ngsl[state.data.ngslIndex]);
    }
  }
  const input = (value) => {
    setState(() => ({
      input: value,
      v1: '',
      v2: '',
      v3: '',
      v4: '',
      v5: '',
      vc: '',
      adj: '',
      adv: '',
      pre: '',
      noun: '',
      pronoun: '',
      conj: '',
      subConj: '',
      relpronoun: '',
      reladj: '',
      reladv: '',
      article: '',
      memo: '',
    }));
    search();
  }
  return (<>
    <Show when={!state.initialized}>
      <button onClick={load}>Select Saved File</button>
      <p>Select saved JSON file</p>
      <p>If you don't have file, you have to create empty json file in first.</p>
    </Show>
    <Show when={state.initialized}>
      <div id="app">
        <main>
          <div>
            <button onClick={prevNgsl}>Prev</button>
            <button onClick={listNGSL}>NGSL #{state.data?.ngslIndex + 1}</button>
            <button onClick={nextNgsl}>Next</button>
          </div>
          <input value={state.input} onInput={e => input(e.currentTarget.value)}/>
          <Show when={state.input}>
              <button onClick={searchWeblio}>weblio</button>
              <button onClick={searchYouglish}>YouGlish</button>
              <button onClick={searchSkell}>SKELL</button>
            
            <dl>
              <dt>
                <label><input type="checkbox" checked={!!state.v1} disabled/> Action Verb: S {state.input}</label>
              </dt>
              <dd>
                <input value={state.v1} onInput={e => setState(() => ({v1: e.currentTarget.value}))}/>
              </dd>
              <dt>
                <label><input type="checkbox" checked={!!state.v2} disabled/> Linking Verb: S {state.input} C</label>
              </dt>
              <dd>
                <input value={state.v2} onInput={e => setState(() => ({v2: e.currentTarget.value}))}/>
              </dd>
              <dt>
                <label><input type="checkbox" checked={!!state.v3} disabled/> Monotransive Verb: S {state.input} O</label>
              </dt>
              <dd>
                <input value={state.v3} onInput={e => setState(() => ({v3: e.currentTarget.value}))}/>
              </dd>
              <dt>
                <label><input type="checkbox" checked={!!state.v4} disabled/> Ditransive Verb: S {state.input} O1 O2</label>
              </dt>
              <dd>
                <input value={state.v4} onInput={e => setState(() => ({v4: e.currentTarget.value}))}/>
              </dd>
              <dt>
                <label><input type="checkbox" checked={!!state.v5} disabled/> Complex Verb: S {state.input} O C</label>
              </dt>
              <dd>
                <input value={state.v5} onInput={e => setState(() => ({v5: e.currentTarget.value}))}/>
              </dd>
              <dt>
                <label><input type="checkbox" checked={!!state.vc} disabled/> Causative Verb: S {state.input} O V</label>
              </dt>
              <dd>
                <input value={state.vc} onInput={e => setState(() => ({vc: e.currentTarget.value}))}/>
              </dd>
              <dt>
                <label><input type="checkbox" checked={!!state.adj} disabled/> Adjective</label>
              </dt>
              <dd>
                <input value={state.adj} onInput={e => setState(() => ({adj: e.currentTarget.value}))}/>
              </dd>
              <dt>
                <label><input type="checkbox" checked={!!state.adv} disabled/> Adverb</label>
              </dt>
              <dd>
                <input value={state.adv} onInput={e => setState(() => ({adv: e.currentTarget.value}))}/>
              </dd>
              <dt>
                <label><input type="checkbox" checked={!!state.pre} disabled/> Pre-position</label>
              </dt>
              <dd>
                <input value={state.pre} onInput={e => setState(() => ({pre: e.currentTarget.value}))}/>
              </dd>
              <dt>
                <label><input type="checkbox" checked={!!state.noun} disabled/> Noun</label>
              </dt>
              <dd>
                <input value={state.noun} onInput={e => setState(() => ({noun: e.currentTarget.value}))}/>
              </dd>
              <dt>
                <label><input type="checkbox" checked={!!state.pronoun} disabled/> Pronoun</label>
              </dt>
              <dd>
                <input value={state.pronoun} onInput={e => setState(() => ({pronoun: e.currentTarget.value}))}/>
              </dd>
              <dt>
                <label><input type="checkbox" checked={!!state.conj} disabled/> Conjunction</label>
              </dt>
              <dd>
                <input value={state.conj} onInput={e => setState(() => ({conj: e.currentTarget.value}))}/>
              </dd>
              <dt>
                <label><input type="checkbox" checked={!!state.subConj} disabled/> Subordinating Conjunction</label>
              </dt>
              <dd>
                <input value={state.subConj} onInput={e => setState(() => ({subConj: e.currentTarget.value}))}/>
              </dd>
              <dt>
                <label><input type="checkbox" checked={!!state.relpronoun} disabled/> Relative Pronoun</label>
              </dt>
              <dd>
                <input value={state.relpronoun} onInput={e => setState(() => ({relpronoun: e.currentTarget.value}))}/>
              </dd>
              <dt>
                <label><input type="checkbox" checked={!!state.reladj} disabled/> Relative Adjective</label>
              </dt>
              <dd>
                <input value={state.reladj} onInput={e => setState(() => ({reladj: e.currentTarget.value}))}/>
              </dd>
              <dt>
                <label><input type="checkbox" checked={!!state.reladv} disabled/> Relative Adverb</label>
              </dt>
              <dd>
                <input value={state.reladv} onInput={e => setState(() => ({reladv: e.currentTarget.value}))}/>
              </dd>
              <dt>
                <label><input type="checkbox" checked={!!state.article} disabled/> Article</label>
              </dt>
              <dd>
                <input value={state.article} onInput={e => setState(() => ({article: e.currentTarget.value}))}/>
              </dd>
            </dl>
            <textarea value={state.memo} onInput={e => setState(() => ({memo: e.currentTarget.value}))}></textarea>
            <button onClick={save}>Save</button>
            <div>{state.lastModified}</div>
          </Show>
        </main>
        <aside>
          <Switch>
            <Match when={state.method === 'ngsl'}>
              <ol class="ngsl-list">
                <For each={ngsl}>
                  {(item, i) => <li>{item}</li>}
                </For>
              </ol>
            </Match>
          </Switch>
          <Show when={state.src}>
            <iframe src={state.src} frameborder="0" noopener noreferer></iframe>
          </Show>
        </aside>
      </div>
    </Show>
  </>);
}

export default App;
