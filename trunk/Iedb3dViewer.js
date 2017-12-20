/**
 *	This Object is used to build the jsMol implementation of the IEDB 3d Object Viewer.  It requires the jsMol library.
 *
 *	Input config JSON Object in the following configuration:
 * 
 *	{
 * 		type : '',			//Required can be 'antibody','tcr','mhc'
 * 		pdbId : '',			//Required
 *	 	width : '',			//Optional 
 *		height : '',		//Optional
 *		dataFormat : ''		//Optional, instructs how the data is formatted, only option now is 'IEDBComplex' that is the format that comes strait from the IEDB Complex table.
 *	}
 *
 *
 *	Input data JSON Object in the following configurations:
 *	
 *	Antibody:
 *		{
 *			residueData: {
 *				epitopeResID : '',
 *				receptorResID : '',
 *			},
 *			chainData : {
 *				chain1_type : '',
 *				chain2_type : '',
 *				chain1_ID : '',
 *				chain2_ID : '',
 *				antigenChain : ''
 *			}
 *		}
 *		
 *	TCR:
 *		{
 *			residueData: {
 *				epitopeMHCResID : '',
 * 				mhcEpitopeResID : '',
 *				epitopeTCRResID : '',
 *				tcrEpitopeResID : ''
 *			},
 *			chainData : {
 *				chain1_type : '',
 *				chain2_type : '',
 *				mhc_chain1_type : '',
 *				mhc_chain2_type : '',
 *				chain1_ID : '',
 *				chain2_ID : '',
 *				mhc_chain1_ID : '',
 *				mhc_chain2_ID : '',
 * 				epitopeChain : ''
 *			}
 * 		}
 *
 *	MHC:
 *		{
 *			residueData: {
 *				epitopeResID : '',
 *				mhcResID : ''
 *			},
 *			chainData : {
 *				mhc_chain1_type : '',
 *				mhc_chain2_type : '',
 *				mhc_chain1_ID : '',
 *				mhc_chain2_ID : '',
 *				epitopeChain : ''
 *			}
 *		}
 *
 *	All jsMol objects are created and stored in local variables to be retrieved and inserted into the calling page.
 *
 *	_ variables and function are private.
 *
 *	Must be built in the window.onload function on the calling page.
 *
 */
 
function Iedb3dViewer(config,data)
{
	var _this = this;

	// Required config set variables.
	var _type = config.type;
	var _pdbId = config.pdbId;
	// Required data set variables
	var _residueData = data.residueData;
	var _chainData = data.chainData;
	// Optional config set variables.
	var _appletName = config.appletName || "jsmolApplet";
	var _appletWidth = config.width || 600;
	var _appletHeight = config.height || 600;
	var _dataFormat = config.dataFormat || null;
	
	// Local Variables
	var _pdbUrl;
	var _interactiveResID;
	var _curInteractiveResID;
	var _chain;
	var _jmolApplet;
	var _buttonArray = [];
	var _chainCheckboxArray = [];
	var _calculatedContactsCheckboxArray = [];
	var _curatedContactsCheckboxArray = [];
	
	// Constructor function.
	
	function _init()
	{		
		_buildPDBurl();
		
		switch(_type.toLowerCase())
		{
			case "antibody":			
        var cnt=0;
        if (_chainData.chain1_ID){
          _chain[cnt]=[_chainData.chain1_ID, _chainData.chain1_type, "#800000"]
          cnt=cnt+1;
         }
        if (_chainData.chain2_ID){
          _chain[cnt]=[_chainData.chain2_ID, _chainData.chain2_type, "#00CED1"]
          cnt=cnt+1;
        }
        if (_chainData.antigenChain){
          _chain[cnt]=[_formatChainData(_chainData.antigenChain),"Epitope Chain","#B0C4DE"]
          cnt=cnt+1;
         }
         else{
          console.log("***Error: Antigen chain ID is missing.")
         }

				_interactiveResID = [ [_formatResidueData(_residueData.epitopeResID),"Epitope Residues","#0000FF"],[_formatResidueData(_residueData.receptorResID),"Receptor Residue","#FFD700"] ];			
				//_curInteractiveResID = [[_residueData.curEpitopeResID,"Antigen to Antibody (Epitope)","#0000FF"],[_residueData.curReceptorResID,"Antibody to Antigen (Paratope)","#FFD700"]];				
				//_chain = [[_chainData.chain1_ID, _chainData.chain1_type, "#800000"],[_chainData.chain2_ID, _chainData.chain2_type, "#00CED1"],[_formatChainData(_chainData.antigenChain),"Epitope Chain","#B0C4DE"]];			
				break;
			case "tcr":
        var cnt=0;
        if (_chainData.mhc_chain1_ID){
          _chain[cnt]=[_chainData.mhc_chain1_ID, 'MHC-' + _chainData.mhc_chain1_type, "#FF00FF"]
          cnt=cnt+1;
         }
        if (_chainData.mhc_chain2_ID){
          _chain[cnt]=[_chainData.mhc_chain2_ID, 'MHC-' + _chainData.mhc_chain2_type, "#006400"]
          cnt=cnt+1;
        }
        if (_chainData.chain1_ID){
          _chain[cnt]=[_chainData.chain1_ID,'TCR-' + _chainData.chain1_type, "#800000"]
          cnt=cnt+1;
         }
        if (_chainData.chain2_ID){
          _chain[cnt]=[_chainData.chain2_ID, 'TCR-'+ _chainData.chain2_type, "#00CED1"]
          cnt=cnt+1;
        }
        if (_chainData.epitopeChain){
          _chain[cnt]=[_formatChainData(_chainData.epitopeChain),"Epitope Chain","#B0C4DE"]
          cnt=cnt+1;
         }
         else{
          console.log("***Error: Antigen chain ID is missing.")
         }

				_interactiveResID = [[_formatResidueData(_residueData.epitopeMHCResID),"MHC to epitope","#0000FF"],[_formatResidueData(_residueData.epitopeTCRResID),"TCR to epitope","#0000FF"],[_formatResidueData(_residueData.mhcEpitopeResID),"epitope to MHC","#FFD700"],[_formatResidueData(_residueData.tcrEpitopeResID),"epitope to TCR","#FFD700"]];
				//_curInteractiveResID = [[_residueData.curEpitopeMHCResID,"MHC to epitope","#0000FF"],[_residueData.curEpitopeTCRResID,"TCR to epitope","#0000FF"],[_residueData.curMhcEpitopeResID,"epitope to MHC","#FFD700"],[_residueData.curTcrEpitopeResID,"epitope to TCR","#FFD700"]];				
				//_chain = [[_chainData.mhc_chain1_ID, 'MHC-' + _chainData.mhc_chain1_type, "#FF00FF"],[_chainData.mhc_chain2_ID, 'MHC-' + _chainData.mhc_chain2_type, "#006400"],[_chainData.chain1_ID,'TCR-' + _chainData.chain1_type, "#800000"],[_chainData.chain2_ID, 'TCR-'+ _chainData.chain2_type, "#00CED1"],[_formatChainData(_chainData.epitopeChain),"Epitope Chain","#B0C4DE"]];
				break;
			case "mhc":
        var cnt=0;
        if (_chainData.mhc_chain1_ID){
          _chain[cnt]=[_chainData.mhc_chain1_ID, 'MHC-' + _chainData.mhc_chain1_type, "#FF00FF"]
          cnt=cnt+1;
         }
        if (_chainData.mhc_chain2_ID){
          _chain[cnt]=[_chainData.mhc_chain2_ID, 'MHC-' + _chainData.mhc_chain2_type, "#006400"]
          cnt=cnt+1;
        }
        if (_chainData.epitopeChain){
          _chain[cnt]=[_formatChainData(_chainData.epitopeChain),"Epitope Chain","#B0C4DE"]
          cnt=cnt+1;
         }
         else{
          console.log("***Error: Antigen chain ID is missing.")
         }

				_interactiveResID = [[_formatResidueData(_residueData.epitopeResID),"Epitope to MHC","#0000FF"],[_formatResidueData(_residueData.mhcResID),"MHC to epitope","#FFD700"]];
				//_curInteractiveResID = [[_formatResidueData(_residueData.curEpitopeResID),"Epitope to MHC","#0000FF"],[_formatResidueData(_residueData.curMhcResID),"MHC to epitope","#FFD700"]];
				//_chain = [[_chainData.mhc_chain1_ID, 'MHC-' + _chainData.mhc_chain1_type, "#FF00FF"],[_chainData.mhc_chain2_ID,'MHC-' + _chainData.mhc_chain2_type, "#006400"],[_formatChainData(_chainData.epitopeChain),"Epitope Chain","#B0C4DE"]];			
				break;				
			default:
				//Something is wrong, we need to handle this error somehow...
		}
		
		_buildComplex();
		
		return _this;
	}

	// Builds the url to the PDB file to be used
	
	function _buildPDBurl()
	{	
// 		_lowerCasePDBID = _pdbId.toLowerCase();
		if (_pdbId.length == 4)
		{
// 			_pdbUrl = 'http://www.rcsb.org/pdb/files/' + _pdbId + '.pdb.gz';
<<<<<<< .mine
// 			_pdbUrl = 'http://downloads.iedb.org/datasets/pdb/retrieve_pdb.php?pdb_id=' + _pdbId.toLowerCase();
// 			_pdbUrl = 'http://downloads.iedb.org/datasets/pdb/'+ _pdbId.toLowerCase().slice(1,3) +'/pdb' + _pdbId.toLowerCase() +'.ent.gz';
			_pdbUrl = 'http://downloads.iedb.org/datasets/retrieve_pdb.php?pdb=pdb'+ _pdbId.toLowerCase() +'.ent.gz';
=======
 			_pdbUrl = 'http://downloads.iedb.org/datasets/pdb/retrieve_pdb.php?pdb=pdb' + _pdbId.toLowerCase() +'.ent.gz';
//			_pdbUrl = 'http://downloads.iedb.org/datasets/pdb/'+ _pdbId.toLowerCase().slice(1,3) +'/pdb' + _pdbId.toLowerCase() +'.ent.gz';
>>>>>>> .r3326
// 			_pdbUrl = 'http://moles.liai.org/pdb' + _pdbId.toLowerCase() +'.ent.gz';
// 			_pdbUrl = 'http://moles.liai.org/' + _pdbId.toLowerCase();
		} 
		else if (_pdbId.length == 5) 
		{
			//Placeholder for PIGS url decoration such as: PDBurl = ''
		} 
		else 
		{
			//Something is wrong with our PDB ID we need to handle this error somehow...
			//alert("invalid PDB ID")
		}
	};
	
	// Formats chain data based on the set dataformat, or does nothing if no explicit format is set.
	
	
	function _formatChainData(chainData)
	{
		var formattedChainData = chainData;
		
		if (_dataFormat == 'IEDBComplex')
		{
			formattedChainData = chainData.split('').join(',:');
		}
// 		console.log('********************************************************************************************');
//         console.log('**********************************Unformatted Chain******************************************');
//         console.log(chainData);
//         console.log('**********************************Formatted Chain*****************************************');
//         console.log(formattedChainData);
//         console.log('********************************************************************************************');
		
		return formattedChainData;
	}
	
	// Formats residue data based on the set dataformat, or does nothing if no explicit format is set.
	
function _formatResidueData(residueData)
	{
		var formattedResidueData = residueData;
		
		if (_dataFormat == 'IEDBComplex')
		{
		
// 		Get rid of the appending ';' to prevent it loop through a null element and create unexpected formatted result

			var chainArray = residueData.replace(/\;$/, '').split(';');
			
			var formattedDataArray = [];
			
// 			console.log('the chainArray length is ' + chainArray.length.toString());
			
			
			for (i = 0; i < chainArray.length; i++) { 
				var residueArray = chainArray[i].split(':');
<<<<<<< .mine
				console.log(chainArray[i]);
				var residueChainId = residueArray[0].replace(/[^a-zA-Z0-9]/g,'');
        		if (residueArray[1]){
				  	var residueNumberArray = residueArray[1].split(',');
				  	
// 				  	console.log('the residueNumberArray is ' + residueNumberArray);
// 				  	console.log('the residueNumberArray length is ' + residueNumberArray.length.toString());
        		}
=======
				// chain ids are case-sensitive and can be numbers
				var residueChainId = residueArray[0].replace(/[^a-zA-Z0-9]/g,'');
				if (residueArray[1]){
				var residueNumberArray = residueArray[1].split(',');
>>>>>>> .r3326
        }
				
				for (j = 0; j < residueNumberArray.length; j++) 
				{
					residueNumberArray[j] = residueNumberArray[j].replace(/\([^)]+\)/g,'');
<<<<<<< .mine
					residueNumberArray[j] = residueNumberArray[j].replace(/^[^0-9]+/g,'');
					
					console.log('the residue number is' + residueNumberArray[j]);

          			var insert = residueNumberArray[j].match(/^(\d+)([A-Z])+/);
          			console.log(insert);
          			
         			if (insert){
            			residueNumberArray[j] = insert[1] +'^'+ insert[2]+ ":" + residueChainId;
          			} else {
          				residueNumberArray[j] = residueNumberArray[j] + ":" + residueChainId;
          			}
          			
=======
          // residue numbers can contain alphabets
					residueNumberArray[j] = residueNumberArray[j].replace(/^[^0-9]+/g,'') 
          var insert = residueNumberArray[j].match(/^(\d+)([A-Z])+/);
          if (insert){
            residueNumberArray[j] = insert[1] +'^'+ insert[2]+ ":" + residueChainId;
          }
          else{
          residueNumberArray[j] = residueNumberArray[j] + ":" + residueChainId;
          }
>>>>>>> .r3326
				}
				
				formattedDataArray[i] = residueNumberArray.join(',');
// 				console.log('the formattedDataArray is ' + formattedDataArray[i]);
			
			}			
			
			formattedResidueData = formattedDataArray.join(',');
		}
        console.log('********************************************************************************************');
        console.log('**********************************Unformatted Residue******************************************');
        console.log(residueData);
        console.log('**********************************Formatted Residue*****************************************');
        console.log(formattedResidueData);
        console.log('********************************************************************************************');
		return formattedResidueData;
	}
	
	// Main function used to build the jsMol applet.
	
	function _buildComplex()
	{
		var resIDScript = [];
		var chainScript = [];
		var curResIDScript = [];


		var receptorChainArray = [];
// Store all the receptor chain_ids in an array then use a logic to tell whether an epitope chain_id would overlap in the end		
		for (i = 0; i < _chain.length; i++) {
		//push all the non-epitope chain into an array
			if (_chain[i][1] != "Epitope Chain") {
				receptorChainArray.push(_chain[i][0]);
			}
		}

		// Scripts act on chains from molecule 1		
		for (i = 0; i < _chain.length; i++) { 
			chainScript[i] = 'select :' + _chain[i][0] + '; wireframe off; cartoon; cpk off; color \"' + _chain[i][2] + '\";';
		}	

		// Scripts act on calculated residues from molecule 2
		
		for (i = 0; i < _interactiveResID.length; i++) { 
			resIDScript[i] = 'select (' + _interactiveResID[i][0] + '); spacefill only; spacefill 40%; wireframe 0.4; color \"' + _interactiveResID[i][2] + '\";';
		}
		
		jmol_isReady = function(applet) {
			Jmol._getElement(applet, "appletdiv").style.border="2px solid gray"
		}

		// The following section load default structure with default representation upon page loading

		script = 'h2oOn=true;'
//			+'set animframecallback "jmolscript:if (!selectionHalos) {select model=_modelNumber}";'
//			+'set errorCallback "myCallback";'
//			+'set defaultloadscript "isDssp = false;'
//			+'set defaultVDW babel;if(!h2oOn){display !water}";'
//			+'set zoomlarge false;'
			+'set echo top left;'
			+'echo loading structure;'
			+'refresh; load MODELS ({0}) "'
			
			//load multiple molecules for different layers of representation
			+ _pdbUrl + '" "' + _pdbUrl
			+ '";'
			//turn everything off
			+ 'cartoon off; wireframe off; spacefill off;'
			+ 'center :' + _chain[0][0] + ';'
			
			//activate all models/molecules been loaded
			+ 'frame 1;';

// Create cartoon chain representation when it is not an "epitope chain" or when the epitope chain_id dose not overlap 
// with the receptor chain_ids

		for (i = 0; i < _chain.length; i++) {
			if (_chain[i][1] != "Epitope Chain") {
// 				receptorChainString += _chain[i][0].replace(/[,:]/g,'');
				script += chainScript[i];
			} else if (receptorChainArray.indexOf(_chain[i][0]) == -1) {
				script += chainScript[i];
			}
		}

		var Info = {
			width : _appletWidth,
			height : _appletHeight,
			debug : false,
			color : "white",
			addSelectionOptions : false,
			serverURL : "https://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php",
			use : "HTML5",  	// logic is set by indicating order of USE -- default is HTML5 for this test page, though JAVA HTML5 WEBGL IMAGE  are all options
			j2sPath : "j2s",	// THIS MUST BE UPDATED TO POINT TO YOUR j2s DIRECTORY
			readyFunction : jmol_isReady,
			script : script,
			disableInitialConsole : true
		}		
		
		// Required to keep the jsMol applet from creating directly into the document.
		Jmol.setDocument(false)
		
		// Builds the jsMol Applet
		_jmolApplet = Jmol.getApplet(_appletName, Info)
		
		// Building the buttons used in the viewer
		/*
		Jmol.setButtonCss(null,"style='width:120px'")
		_addButton(_buttonArray,"select all; color chain","Default Color");
		_addButton(_buttonArray,"select all; trace only","Trace only");
		_addButton(_buttonArray,"select all; cartoon only","Cartoon Only");
		_addButton(_buttonArray,"select all; backbone only", "Backbone Only");
		_addButton(_buttonArray,"select all; spacefill only; spacefill 23%; wireframe 0.15","Ball&Stick");
		*/
		
		// Building the chain checkboxes
		
		for (i = 0; i < _chain.length; i++) {	
		
		// if it is not epitope chain, display it; otherwise, display it only when the epitope does not overlap with the receptor chains
			if (_chain[i][1] != "Epitope Chain") {
				var styleText = '\<font color=\"' + _chain[i][2] + '\">' + _chain[i][1] + '\<\/font\>';
				_addCheckbox(_chainCheckboxArray,chainScript[i] + 'display displayed or selected', chainScript[i]+ 'hide not displayed or selected;', styleText, true);
			} else if (receptorChainArray.indexOf(_chain[i][0]) == -1) {
				var styleText = '\<font color=\"' + _chain[i][2] + '\">' + _chain[i][1] + '\<\/font\>';
				_addCheckbox(_chainCheckboxArray,chainScript[i] + 'display displayed or selected', chainScript[i]+ 'hide not displayed or selected;', styleText, true);
				console.log(_chain[i][0]);
				console.log(receptorChainArray.indexOf(_chain[i][0]));
			}
		}

	 	// Building the calculated contacts checkboxes
		for (i = 0; i < _interactiveResID.length; i++) {
			var styleText = '\<font color=\"' + _interactiveResID[i][2] + '\">' + _interactiveResID[i][1] + '\<\/font\>';
			_addCheckbox(_calculatedContactsCheckboxArray,resIDScript[i] + 'display displayed or selected', resIDScript[i]+ 'hide not displayed or selected;', styleText, false);
		}
		
	}
	
	// Returns the raw HTML for the jsMol applet/canvas
	function _getAppletHTML()
	{
		// Required for some reason in order to properly render the canvas of the jsMol applet
		_jmolApplet._cover( false );
	
		return Jmol.getAppletHtml(_jmolApplet);
	}

	// Returns a string of all the button HTML for this applet
	function _getButtonsHTML()
	{
		var buttonsHTML = '';
		
		for (i = 0; i < _buttonArray.length; i++) { 
			buttonsHTML += _buttonArray[i];
		}

		return buttonsHTML;
	}

	// Returns a string of all the chain checkboxes HTML for this applet
	function _getChainsCheckboxsHTML()
	{
		var chainsCheckboxsHTML = '';
		
		for (i = 0; i < _chainCheckboxArray.length; i++) { 
			chainsCheckboxsHTML += _chainCheckboxArray[i]
		}

		return chainsCheckboxsHTML;
	}
	
	// Returns a string of all the calculated checkboxes HTML for this applet
	function _getCalculatedContactsCheckboxsHTML()
	{
		var calculatedContactsCheckboxsHTML = '';
		
		for (i = 0; i < _calculatedContactsCheckboxArray.length; i++) { 
			calculatedContactsCheckboxsHTML += _calculatedContactsCheckboxArray[i]
		}

		return calculatedContactsCheckboxsHTML;
	}	

	// Returns a string of all the curated checkboxes HTML for this applet
	function _getCuratedContactsCheckboxsHTML()
	{
		var curatedContactsCheckboxsHTML = '';
		
		for (i = 0; i < _curatedContactsCheckboxArray.length; i++) { 
			curatedContactsCheckboxsHTML += _curatedContactsCheckboxArray[i]
		}

		return curatedContactsCheckboxsHTML;
	}
	
	// Builds the full default 3dViewer HTML to be used by the calling page.
	function _getFullViewerHTML()
	{
		var viewerHTML = '';
		
		viewerHTML = _getAppletHTML();
		/*
		viewerHTML += "<br />";
		viewerHTML += _getButtonsHTML();
		*/
		viewerHTML += "<br/> Chains: "
		viewerHTML += _getChainsCheckboxsHTML();
		viewerHTML += "<br/> Calculated contacts: ";			
		viewerHTML += _getCalculatedContactsCheckboxsHTML();
		
		/*
		viewerHTML += "<br/> Curated Contacts: ";		
		viewerHTML += _getCuratedContactsCheckboxsHTML();		
		*/
		
		return viewerHTML;
	}
	
	// Adds a new jsMol button the the array passed in container
	function _addButton(container,script,text)
	{
		container.push(Jmol.jmolButton(_jmolApplet,script,text));
	}

	// Adds a new jsMol checkbox the the array passed in container
	function _addCheckbox(container,script1, script0, text, ischecked)
	{
		container.push(Jmol.jmolCheckbox(_jmolApplet,script1, script0, text, ischecked));
	}
	
	// Exposes private functions to the calling page.  Can be expanded in the future to allow for more fine-grain control.
	this.getFullViewerHTML = _getFullViewerHTML;
	
	return _init();
}