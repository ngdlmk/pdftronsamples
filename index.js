$(document).on('documentLoaded', function() {
    var docViewer = readerControl.docViewer;
    var annotManager = docViewer.getAnnotationManager();
    loadAnnotations(annotManager, docViewer)
    annotManager.on('annotationChanged', (event, annot, actions) => {
        const annotA = [...annot]
        if(actions === 'add') { 
            if(annotA.length > 0) {
                if(annotA[0].Quads !== undefined) {
                    const annots = localStorage.getItem('annots')
                    if(annots === null) {
                        const annotArr = []
                        const annotG = createAnnotObject(annotA[0])
                        annotArr.push(annotG)
                        localStorage.setItem('annots', JSON.stringify(annotArr))
                    } else {
                        const savedAnnots = JSON.parse(localStorage.getItem('annots'))
                        const annotG = createAnnotObject(annotA[0])
                        savedAnnots.push(annotG)
                        localStorage.setItem('annots', JSON.stringify(savedAnnots))
                    }  
                } 
            }  
        }  
        if(actions === 'delete') {
            deleteAnnotation(annotA[0].Quads, annotA[0].PageNumber)
        }   
    })
})

function createAnnotObject(annot) {
    const pageIndex = annot.PageNumber - 1
    const x1 = annot.Quads[0].x1
    const x2 = annot.Quads[annot.Quads.length - 1].x2
    const y1 = annot.Quads[annot.Quads.length - 1].y1
    const y4 = annot.Quads[0].y4
    const top = { x: x1, y: y4, pageIndex: pageIndex}; 
    const bottom = { x: x2, y: y1, pageIndex: pageIndex};
    const annotObj = {id: annot.Id, Subject: annot.Subject, text: annot.VP, top: top, bottom: bottom, pageNumber: annot.PageNumber, quads: annot.Quads}
    return annotObj
}

function createUnderlineAnnotation(annotManager, top, bottom, pageNumber, docViewer) {
    const annot = new Annotations.TextUnderlineAnnotation() 
    annot.PageNumber = pageNumber; 
    annot.StrokeColor = new Annotations.Color(0, 0, 255); 
    annotManager.addAnnotation(annot); 

    const textHighlightTool = new Tools.TextUnderlineCreateTool(docViewer); 
    textHighlightTool.annotation = annot; 
    textHighlightTool.pageCoordinates[0] = top; 
    textHighlightTool.select(top, bottom); 
}

function createHighlightAnnotation(annotManager, top, bottom, pageNumber, docViewer) {
    const annot = new Annotations.TextHighlightAnnotation(); 
    annot.PageNumber = pageNumber; 
    annot.StrokeColor = new Annotations.Color(0, 0, 255); 
    annotManager.addAnnotation(annot); 

    const textHighlightTool = new Tools.TextHighlightCreateTool(docViewer); 
    textHighlightTool.annotation = annot; 
    textHighlightTool.pageCoordinates[0] = top; 
    textHighlightTool.select(top, bottom);
}

function loadAnnotations(annotManager, docViewer) {
    if(localStorage.getItem("annots") !== undefined && localStorage.getItem("annots") !== null) {
        const annots = JSON.parse(localStorage.getItem("annots"))
        annots.map(annot => {
            if(annot.Subject === 'Underline') 
                createUnderlineAnnotation(annotManager, annot.top, annot.bottom, annot.pageNumber, docViewer)
            if(annot.Subject === 'Highlight') 
                createHighlightAnnotation(annotManager, annot.top, annot.bottom, annot.pageNumber, docViewer)
        })
    }
}

function deleteAnnotation(quads, pageNumber) {
    const annots = JSON.parse(localStorage.getItem('annots'))
    const sQuads = JSON.stringify(quads)
    annots.map((annot, i) => {
        const quads = JSON.stringify(annot.quads)
        if(sQuads === quads && pageNumber === annot.pageNumber) {
            console.log("hell yeah")
            annots.splice(i, 1)
            localStorage.setItem('annots', JSON.stringify(annots))
        }
    }) 
}