/**
 * DOM Utils for Starlin
 * Implements a lightweight DOM Diffing algorithm
 * This allows us to update the page without blowing away focus/state
 */

/**
 * Convert an HTML string into a DOM Node
 * @param {string} html 
 * @returns {HTMLElement}
 */
export function stringToDOM(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}

/**
 * Get the type of a node
 * @param {Node} node 
 * @returns {string}
 */
function getNodeType(node) {
    if (node.nodeType === 3) return 'text';
    if (node.nodeType === 8) return 'comment';
    return node.tagName.toLowerCase();
}

/**
 * Get the content of a node
 * @param {Node} node 
 * @returns {string}
 */
function getNodeContent(node) {
    if (node.childNodes && node.childNodes.length > 0) return null;
    return node.textContent;
}

/**
 * Update the real DOM to match the template DOM
 * @param {HTMLElement} templateNode The new node from the HTML string
 * @param {HTMLElement} realNode The existing node in the DOM
 */
export function diff(templateNode, realNode) {
    // If real node doesn't exist, simply plain return (should be handled by parent)
    if (!realNode) return;

    // 1. If nodes are different types, replace the whole thing
    if (getNodeType(templateNode) !== getNodeType(realNode)) {
        realNode.replaceWith(templateNode.cloneNode(true));
        return;
    }

    // 2. Diff Content (Text Nodes)
    if (templateNode.nodeType === 3) { // Text node
        if (realNode.textContent !== templateNode.textContent) {
            realNode.textContent = templateNode.textContent;
        }
        return;
    }

    // 3. Diff Attributes
    // Remove attributes that are no longer present
    Array.from(realNode.attributes).forEach(attr => {
        if (!templateNode.hasAttribute(attr.name)) {
            realNode.removeAttribute(attr.name);
        }
    });
    // Set new/changed attributes
    Array.from(templateNode.attributes).forEach(attr => {
        // Special handling for value to prevent cursor jumps
        if (attr.name === 'value' && realNode.value === attr.value) {
            return;
        }
        if (realNode.getAttribute(attr.name) !== attr.value) {
            realNode.setAttribute(attr.name, attr.value);
        }
    });

    // 4. Diff Children
    const templateChildren = Array.from(templateNode.childNodes);
    const realChildren = Array.from(realNode.childNodes);

    // Max length to iterate
    const max = Math.max(templateChildren.length, realChildren.length);

    for (let i = 0; i < max; i++) {
        const templateChild = templateChildren[i];
        const realChild = realChildren[i];

        // Case A: New child added
        if (!realChild && templateChild) {
            realNode.appendChild(templateChild.cloneNode(true));
            continue;
        }

        // Case B: Child removed
        if (!templateChild && realChild) {
            realChild.remove();
            continue;
        }

        // Case C: Compare children
        if (templateChild && realChild) {
            diff(templateChild, realChild);
        }
    }
}
