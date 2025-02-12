// 加载流程列表
function loadProcessList() {
    const processList = document.getElementById('processList');
    processList.innerHTML = '';

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('bpmn_')) {
            try {
                const processData = JSON.parse(localStorage.getItem(key));
                const createTime = new Date(processData.createTime || parseInt(key.replace('bpmn_', ''))).toLocaleString();
                
                const div = document.createElement('div');
                div.className = 'process-item';
                div.innerHTML = `
                    <div class="process-info">
                        <div class="process-name">${processData.name || '未命名流程'} (${createTime})</div>
                        <div class="process-tags">
                            ${(processData.tags || []).map(tag => `
                                <span class="tag">
                                    ${tag}
                                    <span class="tag-actions">
                                        <i class="tag-edit" onclick="editTag('${key}', '${tag}')">✎</i>
                                        <i class="tag-delete" onclick="deleteTag('${key}', '${tag}')">×</i>
                                    </span>
                                </span>
                            `).join('')}
                            <button class="add-tag-btn" onclick="addTag('${key}')">+</button>
                        </div>
                    </div>
                    <div class="process-actions">
                        <a href="view.html?id=${key}" class="btn btn-view">查看</a>
                        <a href="edit.html?id=${key}" class="btn btn-edit">编辑</a>
                        <button onclick="deleteProcess('${key}')" class="btn btn-danger">删除</button>
                    </div>
                `;
                processList.appendChild(div);
            } catch (err) {
                console.error('加载流程数据失败:', err);
            }
        }
    }
}

// 添加标签
function addTag(processId) {
    const tag = prompt('请输入标签名称：');
    if (!tag) return;

    const processData = JSON.parse(localStorage.getItem(processId));
    processData.tags = processData.tags || [];
    if (!processData.tags.includes(tag)) {
        processData.tags.push(tag);
        localStorage.setItem(processId, JSON.stringify(processData));
        loadProcessList();
    } else {
        alert('标签已存在');
    }
}

// 编辑标签
function editTag(processId, oldTag) {
    const newTag = prompt('请输入新的标签名称：', oldTag);
    if (!newTag || newTag === oldTag) return;

    const processData = JSON.parse(localStorage.getItem(processId));
    const tagIndex = processData.tags.indexOf(oldTag);
    if (tagIndex !== -1) {
        if (processData.tags.includes(newTag)) {
            alert('标签已存在');
            return;
        }
        processData.tags[tagIndex] = newTag;
        localStorage.setItem(processId, JSON.stringify(processData));
        loadProcessList();
    }
}

// 删除标签
function deleteTag(processId, tag) {
    if (!confirm(`确定要删除标签"${tag}"吗？`)) return;

    const processData = JSON.parse(localStorage.getItem(processId));
    const tagIndex = processData.tags.indexOf(tag);
    if (tagIndex !== -1) {
        processData.tags.splice(tagIndex, 1);
        localStorage.setItem(processId, JSON.stringify(processData));
        loadProcessList();
    }
}

// 删除流程
function deleteProcess(processId) {
    if (confirm('确定要删除该流程吗？')) {
        localStorage.removeItem(processId);
        loadProcessList();
    }
}

// 页面加载完成后加载流程列表
document.addEventListener('DOMContentLoaded', loadProcessList);