const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '.')));

// Root route (Symbol Patcher)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'patcher.html'));
});

// Symbol Getter page
app.get('/symbol-getter', (req, res) => {
  res.send(symbolGetterHTML);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const symbolGetterHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Symbol Getter - Extract IL2CPP Symbols</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: linear-gradient(135deg, #0f051a 0%, #1a0d2e 50%, #2d1a4e 100%);
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  color: #e0e7ff;
  padding: 60px 20px;
  min-height: 100vh;
}
.container { max-width: 750px; margin: 0 auto; }
h1 { margin-bottom: 1rem; font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.subtitle { font-size: 13px; opacity: 0.6; margin-bottom: 3rem; letter-spacing: 0.5px; }
.nav { display: flex; gap: 1rem; margin-bottom: 2rem; }
.nav a { color: #a78bfa; text-decoration: none; font-size: 13px; padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(167, 139, 250, 0.3); transition: all 0.2s; }
.nav a:hover { background: rgba(167, 139, 250, 0.1); }
.section { background: rgba(30, 20, 50, 0.6); backdrop-filter: blur(10px); border: 1px solid rgba(167, 139, 250, 0.15); border-radius: 16px; padding: 2.5rem; margin-bottom: 2rem; transition: all 0.3s ease; }
.section:hover { border-color: rgba(167, 139, 250, 0.25); background: rgba(30, 20, 50, 0.8); }
.label { font-size: 12px; font-weight: 700; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 1.2px; opacity: 0.7; color: #a78bfa; }
.dz { border: 2px dashed rgba(167, 139, 250, 0.4); border-radius: 12px; padding: 3rem 2rem; text-align: center; cursor: pointer; background: linear-gradient(135deg, rgba(50, 30, 100, 0.2) 0%, rgba(100, 50, 150, 0.1) 100%); transition: all 0.3s ease; position: relative; overflow: hidden; }
.dz::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 50% 50%, rgba(167, 139, 250, 0.1) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s ease; }
.dz:hover { border-color: #a78bfa; background: linear-gradient(135deg, rgba(100, 50, 150, 0.3) 0%, rgba(150, 100, 200, 0.1) 100%); }
.dz:hover::before { opacity: 1; }
.dz-text { font-size: 16px; font-weight: 600; margin: 12px 0; color: #e0e7ff; position: relative; z-index: 1; }
.dz-hint { font-size: 13px; opacity: 0.5; position: relative; z-index: 1; }
.dz.active { border-color: #86efac; background: linear-gradient(135deg, rgba(100, 200, 50, 0.2) 0%, rgba(150, 200, 100, 0.1) 100%); }
input[type="file"] { display: none; }
.status { margin-top: 1.5rem; padding: 1rem 1.25rem; border-radius: 10px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 0.75rem; animation: slideIn 0.3s ease; }
@keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
.status.ok { background: rgba(100, 200, 50, 0.1); color: #86efac; border: 1px solid rgba(100, 200, 50, 0.3); }
.status.err { background: rgba(240, 82, 82, 0.1); color: #ff9999; border: 1px solid rgba(240, 82, 82, 0.3); }
.progress { margin-top: 1.5rem; height: 6px; background: rgba(167, 139, 250, 0.1); border-radius: 3px; overflow: hidden; display: none; }
.progress.show { display: block; }
.progress-bar { height: 100%; background: linear-gradient(90deg, #a78bfa, #ec4899); width: 0%; transition: width 0.3s ease; }
.downloads { margin-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; animation: slideIn 0.4s ease; }
.result-header { padding: 1.5rem; background: linear-gradient(135deg, rgba(100, 200, 50, 0.15) 0%, rgba(150, 200, 100, 0.05) 100%); border: 1px solid rgba(100, 200, 50, 0.3); border-radius: 12px; color: #86efac; font-size: 13px; font-weight: 600; text-align: center; margin-bottom: 1.5rem; letter-spacing: 0.5px; }
.download-link { display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg, rgba(134, 239, 172, 0.1) 0%, rgba(134, 239, 172, 0.05) 100%); color: #86efac; padding: 1rem 1.5rem; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 13px; transition: all 0.3s ease; border: 1px solid rgba(134, 239, 172, 0.25); position: relative; overflow: hidden; }
.download-link:hover { background: linear-gradient(135deg, rgba(134, 239, 172, 0.2) 0%, rgba(134, 239, 172, 0.1) 100%); border-color: rgba(134, 239, 172, 0.5); transform: translateY(-2px); box-shadow: 0 10px 25px rgba(134, 239, 172, 0.2); }
.download-icon { margin-left: 1rem; font-size: 16px; }
.toast { position: fixed; bottom: 20px; right: 20px; background: rgba(30, 30, 35, 0.95); backdrop-filter: blur(10px); color: #e0e7ff; padding: 14px 24px; border-radius: 10px; font-size: 13px; opacity: 0; transition: opacity 0.3s ease; pointer-events: none; border: 1px solid rgba(167, 139, 250, 0.2); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); }
.toast.show { opacity: 1; pointer-events: auto; }
</style>
</head>
<body>
  <div class="container">
    <h1>🔍 Symbol Getter</h1>
    <div class="subtitle">Extract IL2CPP symbols from libil2cpp.so and generate files</div>
    
    <div class="nav">
      <a href="/">← Symbol Patcher</a>
    </div>

    <div class="section">
      <div class="label">Upload libil2cpp.so</div>
      <div class="dz" id="dz" onclick="document.getElementById('f').click()">
        <div class="dz-text">📋 Drop libil2cpp.so here</div>
        <div class="dz-hint">or click to browse — processed entirely in your browser</div>
      </div>
      <div id="s"></div>
      <div class="progress" id="prog"><div class="progress-bar" id="pb"></div></div>
      <input type="file" id="f" accept=".so">
    </div>

    <div id="result"></div>
  </div>

  <div class="toast" id="toast"></div>

  <script>
    const toast = (msg) => {
      const el = document.getElementById('toast');
      el.textContent = msg;
      el.className = 'toast show';
      setTimeout(() => el.className = 'toast', 3000);
    };

    const IL2CPP_API = ["il2cpp_init","il2cpp_init_utf16","il2cpp_shutdown","il2cpp_set_config_dir","il2cpp_set_data_dir","il2cpp_set_temp_dir","il2cpp_set_commandline_arguments","il2cpp_set_commandline_arguments_utf16","il2cpp_set_config","il2cpp_class_from_il2cpp_type","il2cpp_array_new_specific","il2cpp_class_from_type","il2cpp_type_get_class_or_element_class","il2cpp_domain_get_assemblies","il2cpp_domain_assembly_open","il2cpp_image_get_name","il2cpp_image_get_entry_point","il2cpp_image_get_class_count","il2cpp_image_get_class","il2cpp_exception_from_name_msg","il2cpp_get_exception_argument_null","il2cpp_format_exception","il2cpp_format_stack_trace","il2cpp_unhandled_exception","il2cpp_field_get_flags","il2cpp_field_get_name","il2cpp_field_get_parent","il2cpp_field_get_type","il2cpp_field_get_value","il2cpp_field_get_value_object","il2cpp_field_has_attribute","il2cpp_field_set_value","il2cpp_field_static_get_value","il2cpp_field_static_set_value","il2cpp_field_get_offset","il2cpp_gc_collect","il2cpp_gc_collect_a_little","il2cpp_gc_disable","il2cpp_gc_enable","il2cpp_gc_is_disabled","il2cpp_gc_get_max_time_slice_ns","il2cpp_gc_set_max_time_slice_ns","il2cpp_gc_get_heap_size","il2cpp_gc_get_used_size","il2cpp_gc_wbarrier_set_field","il2cpp_gchandle_new","il2cpp_gchandle_new_weakref","il2cpp_gchandle_get_target","il2cpp_gchandle_free","il2cpp_gchandle_foreach_get_target","il2cpp_object_header_size","il2cpp_array_object_header_size","il2cpp_offset_of_array_length_in_array_object_header","il2cpp_offset_of_array_bounds_in_array_object_header","il2cpp_allocation_granularity","il2cpp_image_get_assembly","il2cpp_image_get_filename","il2cpp_last_error","il2cpp_method_get_param","il2cpp_method_get_class","il2cpp_method_has_attribute","il2cpp_method_get_flags","il2cpp_method_get_token","il2cpp_method_get_name","il2cpp_method_is_generic","il2cpp_method_is_inflated","il2cpp_method_get_param_count","il2cpp_method_get_generic_param_count","il2cpp_method_get_return_type","il2cpp_method_get_declaring_type","il2cpp_method_get_param_name","il2cpp_method_get_from_reflection","il2cpp_method_get_object","il2cpp_monitor_enter","il2cpp_monitor_try_enter","il2cpp_monitor_exit","il2cpp_monitor_pulse","il2cpp_monitor_pulse_all","il2cpp_monitor_wait","il2cpp_monitor_try_wait","il2cpp_object_new","il2cpp_object_get_virtual_method","il2cpp_object_get_class","il2cpp_object_get_size","il2cpp_object_unbox","il2cpp_value_box","il2cpp_object_destroy","il2cpp_object_new_specific","il2cpp_profiler_install","il2cpp_profiler_set_events","il2cpp_profiler_install_enter_leave","il2cpp_profiler_install_allocation","il2cpp_profiler_install_gc","il2cpp_profiler_install_fileio","il2cpp_profiler_install_thread","il2cpp_property_get_flags","il2cpp_property_get_get_method","il2cpp_property_get_set_method","il2cpp_property_get_name","il2cpp_property_get_parent","il2cpp_object_get_reflection_type","il2cpp_runtime_class_init","il2cpp_runtime_object_init","il2cpp_runtime_object_init_exception","il2cpp_runtime_invoke","il2cpp_runtime_invoke_convert_args","il2cpp_runtime_delegate_invoke","il2cpp_runtime_is_shutting_down","il2cpp_runtime_unhandled_exception_policy_set","il2cpp_string_length","il2cpp_string_chars","il2cpp_string_new","il2cpp_string_new_len","il2cpp_string_new_utf16","il2cpp_string_new_wrapper","il2cpp_string_intern","il2cpp_string_is_interned","il2cpp_thread_current","il2cpp_thread_attach","il2cpp_thread_detach","il2cpp_thread_get_all_attached_threads","il2cpp_is_vm_thread","il2cpp_current_thread_walk_frame_stack","il2cpp_thread_walk_frame_stack","il2cpp_current_thread_get_top_frame","il2cpp_thread_get_top_frame","il2cpp_current_thread_get_frame_at","il2cpp_thread_get_frame_at","il2cpp_current_thread_get_stack_depth","il2cpp_thread_get_stack_depth","il2cpp_override_stack_backtrace","il2cpp_type_get_object","il2cpp_type_get_type","il2cpp_type_get_name","il2cpp_type_get_assembly_qualified_name","il2cpp_type_is_byref","il2cpp_type_get_attrs","il2cpp_type_equals","il2cpp_type_get_name_chunked","il2cpp_array_new","il2cpp_array_new_full","il2cpp_bounded_array_class_get","il2cpp_array_element_size","il2cpp_array_length","il2cpp_array_get_byte_length","il2cpp_array_class_get","il2cpp_array_get","il2cpp_array_set","il2cpp_class_array_element_size","il2cpp_class_element_class","il2cpp_class_enum_basetype","il2cpp_class_is_generic","il2cpp_class_is_inflated","il2cpp_class_is_assignable_from","il2cpp_class_is_subclass_of","il2cpp_class_has_parent","il2cpp_class_from_name","il2cpp_class_from_system_type","il2cpp_class_get_element_class","il2cpp_class_get_events","il2cpp_class_get_fields","il2cpp_class_get_nested_types","il2cpp_class_get_interfaces","il2cpp_class_get_properties","il2cpp_class_get_property_from_name","il2cpp_class_get_field_from_name","il2cpp_class_get_methods","il2cpp_class_get_method_from_name","il2cpp_class_get_name","il2cpp_class_get_namespace","il2cpp_class_get_parent","il2cpp_class_get_declaring_type","il2cpp_class_instance_size","il2cpp_class_num_fields","il2cpp_class_is_valuetype","il2cpp_class_value_size","il2cpp_class_is_blittable","il2cpp_class_get_flags","il2cpp_class_is_abstract","il2cpp_class_is_interface","il2cpp_class_array_new","il2cpp_class_get_type","il2cpp_class_get_type_token","il2cpp_class_has_attribute","il2cpp_class_has_references","il2cpp_class_is_enum","il2cpp_class_is_null_class","il2cpp_class_get_image","il2cpp_class_get_assemblyname","il2cpp_class_get_rank","il2cpp_class_get_data_size","il2cpp_class_get_static_field_data","il2cpp_class_get_bitmap_size","il2cpp_class_get_bitmap","il2cpp_stats_dump_to_file","il2cpp_stats_get_value","il2cpp_domain_get","il2cpp_field_set_value_object","il2cpp_object_new_from_index","il2cpp_object_get_field_count","il2cpp_object_pool_get","il2cpp_object_pool_return","il2cpp_config_string_to_utf8","il2cpp_config_set_maximum_threads_alive","il2cpp_config_get_maximum_threads_alive","il2cpp_array_set_byte_length"];
    const SKIP_RE = /^(_Z|SystemNative|Java_|pthread|__cxa|__start|__stop|NLSocket|ZStream|Flush|Dll[CG]|Globalization|JNI_|ReadEvents|mono_pal|__dynamic|__gxx|UnityAds|CloseN|CreateN)/;

    function r32(b,o){return((b[o]|(b[o+1]<<8)|(b[o+2]<<16)|(b[o+3]<<24))>>>0);}
    function r64(b,o){return r32(b,o+4)*0x100000000+r32(b,o);}
    function r16(b,o){return b[o]|(b[o+1]<<8);}
    function cstr(b,o){let s='';while(o<b.length&&b[o]!==0)s+=String.fromCharCode(b[o++]);return s;}

    function extractObfSymbols(buf) {
      if(buf[0]!==0x7f||buf[1]!==0x45||buf[2]!==0x4c||buf[3]!==0x46)throw new Error('Not an ELF file');
      const is64=buf[4]===2;
      const entries=[];
      if(is64){
        const shoff=r64(buf,40),shentsz=r16(buf,58),shnum=r16(buf,60);
        const secs=[];
        for(let i=0;i<shnum;i++){const b=Number(shoff)+i*shentsz;secs.push({type:r32(buf,b+4),off:r64(buf,b+24),size:r64(buf,b+32),link:r32(buf,b+40),entsz:r64(buf,b+56)});}
        for(const s of secs){if(s.type!==11&&s.type!==2)continue;const strsec=secs[s.link];const esz=Number(s.entsz)||24;const cnt=Math.floor(Number(s.size)/esz);for(let j=0;j<cnt;j++){const b=Number(s.off)+j*esz;const nm=r32(buf,b);const info=buf[b+4];const shndx=r16(buf,b+6);const addr=r64(buf,b+8);const bind=info>>4;if(shndx!==0&&shndx!==0xfff1&&bind===1){const name=cstr(buf,Number(strsec.off)+nm);if(name&&!SKIP_RE.test(name)&&/^[A-Za-z_][A-Za-z0-9_]{2,}$/.test(name))entries.push({name,addr:Number(addr)});}}}
      } else {
        const shoff=r32(buf,32),shentsz=r16(buf,46),shnum=r16(buf,48);
        const secs=[];
        for(let i=0;i<shnum;i++){const b=shoff+i*shentsz;secs.push({type:r32(buf,b+4),off:r32(buf,b+16),size:r32(buf,b+20),link:r32(buf,b+24),entsz:r32(buf,b+36)});}
        for(const s of secs){if(s.type!==11&&s.type!==2)continue;const strsec=secs[s.link];const esz=s.entsz||16;const cnt=Math.floor(s.size/esz);for(let j=0;j<cnt;j++){const b=s.off+j*esz;const nm=r32(buf,b);const addr=r32(buf,b+4);const info=buf[b+12];const shndx=r16(buf,b+14);const bind=info>>4;if(shndx!==0&&shndx!==0xfff1&&bind===1){const name=cstr(buf,strsec.off+nm);if(name&&!SKIP_RE.test(name)&&/^[A-Za-z_][A-Za-z0-9_]{2,}$/.test(name))entries.push({name,addr});}}}
      }
      entries.sort((a,b)=>a.addr-b.addr);
      return [...new Map(entries.map(e=>[e.name,e])).values()].sort((a,b)=>a.addr-b.addr).map(e=>e.name);
    }

    function buildMap(syms){const map={};const len=Math.min(syms.length,IL2CPP_API.length);for(let i=0;i<len;i++)map[IL2CPP_API[i]]=syms[i];return map;}

    const dz = document.getElementById('dz');
    const inp = document.getElementById('f');
    
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('active'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('active'));
    dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('active'); inp.files = e.dataTransfer.files; inp.dispatchEvent(new Event('change')); });
    
    inp.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.name.endsWith('.so')) {
        document.getElementById('s').className = 'status err';
        document.getElementById('s').textContent = '✗ Need a .so file';
        return;
      }

      const progEl = document.getElementById('prog');
      const pbEl = document.getElementById('pb');
      const stEl = document.getElementById('s');

      stEl.className = 'status';
      stEl.textContent = 'Reading file...';
      progEl.className = 'progress show';
      pbEl.style.width = '10%';

      const buf = new Uint8Array(await file.arrayBuffer());
      pbEl.style.width = '45%';
      stEl.textContent = 'Parsing ELF...';

      let syms;
      try {
        syms = extractObfSymbols(buf);
      } catch (err) {
        stEl.textContent = 'ELF error: ' + err.message;
        stEl.className = 'status err';
        return;
      }

      pbEl.style.width = '90%';
      const map = buildMap(syms);
      const cnt = Object.keys(map).length;
      pbEl.style.width = '100%';
      stEl.textContent = '✓ Parsed ' + cnt + ' symbols';
      stEl.className = 'status ok';

      const resultEl = document.getElementById('result');
      resultEl.innerHTML = '';

      const headerEl = document.createElement('div');
      headerEl.className = 'result-header';
      headerEl.innerHTML = '✓ Extracted ' + cnt + ' IL2CPP symbols';
      resultEl.appendChild(headerEl);

      const downloadsEl = document.createElement('div');
      downloadsEl.className = 'downloads';

      const mapBlob = new Blob([JSON.stringify(map, null, 2)], { type: 'application/json' });
      const mapUrl = URL.createObjectURL(mapBlob);
      const mapLink = document.createElement('a');
      mapLink.href = mapUrl;
      mapLink.download = 'SymbolMap.json';
      mapLink.className = 'download-link';
      mapLink.innerHTML = '<span>⬇ SymbolMap.json</span><span class="download-icon">↓</span>';
      downloadsEl.appendChild(mapLink);

      let fridaContent = 'IL2Cpp.$config.exports = {\n';
      for (const [api, obf] of Object.entries(map)) {
        fridaContent += '  ' + api + ': () => IL2Cpp.module.findExportByName("' + obf + '"),\n';
      }
      fridaContent += '};\n';

      const fridaBlob = new Blob([fridaContent], { type: 'text/javascript' });
      const fridaUrl = URL.createObjectURL(fridaBlob);
      const fridaLink = document.createElement('a');
      fridaLink.href = fridaUrl;
      fridaLink.download = 'Frida-Map.js';
      fridaLink.className = 'download-link';
      fridaLink.innerHTML = '<span>⬇ Frida-Map.js</span><span class="download-icon">↓</span>';
      downloadsEl.appendChild(fridaLink);

      resultEl.appendChild(downloadsEl);
      setTimeout(() => { progEl.className = 'progress'; }, 700);
      toast('✓ Symbol extraction complete');
    });
  </script>
</body>
</html>`;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
