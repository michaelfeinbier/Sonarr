import PropTypes from 'prop-types';
import React, { Component } from 'react';
import HistoryDetailsConnector from 'Activity/History/Details/HistoryDetailsConnector';
import HistoryEventTypeCell from 'Activity/History/HistoryEventTypeCell';
import Icon from 'Components/Icon';
import IconButton from 'Components/Link/IconButton';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import RelativeDateCellConnector from 'Components/Table/Cells/RelativeDateCellConnector';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';
import Popover from 'Components/Tooltip/Popover';
import EpisodeFormats from 'Episode/EpisodeFormats';
import EpisodeLanguages from 'Episode/EpisodeLanguages';
import EpisodeQuality from 'Episode/EpisodeQuality';
import { icons, kinds, tooltipPositions } from 'Helpers/Props';
import formatCustomFormatScore from 'Utilities/Number/formatCustomFormatScore';
import translate from 'Utilities/String/translate';
import styles from './EpisodeHistoryRow.css';

function getTitle(eventType) {
  switch (eventType) {
    case 'grabbed': return 'Grabbed';
    case 'seriesFolderImported': return 'Series Folder Imported';
    case 'downloadFolderImported': return 'Download Folder Imported';
    case 'downloadFailed': return 'Download Failed';
    case 'episodeFileDeleted': return 'Episode File Deleted';
    case 'episodeFileRenamed': return 'Episode File Renamed';
    default: return 'Unknown';
  }
}

class EpisodeHistoryRow extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isMarkAsFailedModalOpen: false
    };
  }

  //
  // Listeners

  onMarkAsFailedPress = () => {
    this.setState({ isMarkAsFailedModalOpen: true });
  };

  onConfirmMarkAsFailed = () => {
    this.props.onMarkAsFailedPress(this.props.id);
    this.setState({ isMarkAsFailedModalOpen: false });
  };

  onMarkAsFailedModalClose = () => {
    this.setState({ isMarkAsFailedModalOpen: false });
  };

  //
  // Render

  render() {
    const {
      eventType,
      sourceTitle,
      languages,
      quality,
      qualityCutoffNotMet,
      customFormats,
      customFormatScore,
      date,
      data,
      downloadId
    } = this.props;

    const {
      isMarkAsFailedModalOpen
    } = this.state;

    return (
      <TableRow>
        <HistoryEventTypeCell
          eventType={eventType}
          data={data}
        />

        <TableRowCell>
          {sourceTitle}
        </TableRowCell>

        <TableRowCell>
          <EpisodeLanguages languages={languages} />
        </TableRowCell>

        <TableRowCell>
          <EpisodeQuality
            quality={quality}
            isCutoffNotMet={qualityCutoffNotMet}
          />
        </TableRowCell>

        <TableRowCell>
          <EpisodeFormats formats={customFormats} />
        </TableRowCell>

        <TableRowCell>
          {formatCustomFormatScore(customFormatScore, customFormats.length)}
        </TableRowCell>

        <RelativeDateCellConnector
          date={date}
          includeSeconds={true}
          includeTime={true}
        />

        <TableRowCell className={styles.actions}>
          <Popover
            anchor={
              <Icon
                name={icons.INFO}
              />
            }
            title={getTitle(eventType)}
            body={
              <HistoryDetailsConnector
                eventType={eventType}
                sourceTitle={sourceTitle}
                data={data}
                downloadId={downloadId}
              />
            }
            position={tooltipPositions.LEFT}
          />

          {
            eventType === 'grabbed' &&
              <IconButton
                title={translate('MarkAsFailed')}
                name={icons.REMOVE}
                size={14}
                onPress={this.onMarkAsFailedPress}
              />
          }
        </TableRowCell>

        <ConfirmModal
          isOpen={isMarkAsFailedModalOpen}
          kind={kinds.DANGER}
          title={translate('MarkAsFailed')}
          message={translate('MarkAsFailedConfirmation', { sourceTitle })}
          confirmLabel={translate('MarkAsFailed')}
          onConfirm={this.onConfirmMarkAsFailed}
          onCancel={this.onMarkAsFailedModalClose}
        />
      </TableRow>
    );
  }
}

EpisodeHistoryRow.propTypes = {
  id: PropTypes.number.isRequired,
  eventType: PropTypes.string.isRequired,
  sourceTitle: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(PropTypes.object).isRequired,
  quality: PropTypes.object.isRequired,
  qualityCutoffNotMet: PropTypes.bool.isRequired,
  customFormats: PropTypes.arrayOf(PropTypes.object),
  customFormatScore: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  downloadId: PropTypes.string,
  onMarkAsFailedPress: PropTypes.func.isRequired
};

export default EpisodeHistoryRow;
