import jsPDF from 'jspdf';
import type {PersonNodeType} from "@/components/PersonNode.tsx";

/**
 * Export React Flow diagram to PDF by rendering nodes and edges manually.
 * This avoids blur and missing edges from html2canvas.
 */
export function exportFlowToPDF(
    nodes: PersonNodeType[],
    edges: { id: string; source: string; target: string }[],
    filename = 'graph.pdf'
) {
    const pdf = new jsPDF('landscape', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Find the bounds of the graph
    const allX = nodes.map(n => n.position.x);
    const allY = nodes.map(n => n.position.y);
    const minX = Math.min(...allX);
    const minY = Math.min(...allY);
    const maxX = Math.max(...allX);
    const maxY = Math.max(...allY);

    const scaleX = pdfWidth / (maxX - minX + 100);
    const scaleY = pdfHeight / (maxY - minY + 100);
    const scale = Math.min(scaleX, scaleY);

    // Draw edges first
    edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        if (!sourceNode || !targetNode) return;

        pdf.setDrawColor(0, 0, 0); // black
        pdf.setLineWidth(1);
        pdf.line(
            (sourceNode.position.x - minX) * scale + 50,
            (sourceNode.position.y - minY) * scale + 50,
            (targetNode.position.x - minX) * scale + 50,
            (targetNode.position.y - minY) * scale + 50
        );
    });

    // Draw nodes
    nodes.forEach(node => {
        const x = (node.position.x - minX) * scale + 50;
        const y = (node.position.y - minY) * scale + 50;
        const radius = 25; // node size

        pdf.setFillColor(16, 185, 129); // emerald
        pdf.circle(x, y, radius, 'FD'); // fill + stroke

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.text(node.data.firstName, x, y, { align: 'center', baseline: 'middle' });
    });

    pdf.save(filename);
}
